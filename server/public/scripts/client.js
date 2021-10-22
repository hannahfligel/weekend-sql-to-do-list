$( document ).ready( onReady );

function onReady(){
    getListItem();
    $( '#addTaskButton' ).on( 'click', addTask );
    //target the parent id of the delete item
    $( '#todoOut1' ).on( 'click', '.deleteConfirm', deleteItem );
    $( '#todoOut1' ).on( 'click', '.completeItem', completeItem );
    $( '.categoryIn' ).on( 'click', addCategory );
}

function getListItem(){
    console.log("in getListItem");
    $.ajax({
        method: 'GET',
        url:'/todo'
    }).then(function(response){
        console.log('back from server:', response)
        el=$('#todoOut1');
        el.empty();
        // append each todo item to DOM
        //reverse loop to bring the new to do item to the top of the list 
        for(i=response.length-1; i>=0; i--){
            if(!response[i].status){
                el.append(`
                <div class="cardContainer col">
                    <div class="row">
                        <div class="col-4">
                            <h6>Task</h6>
                            <p class="cardInfo">${response[i].task}</p>
                        </div>
                        <div class="col">
                            <h6>Category</h6>
                            <p class="cardInfo">${response[i].category}</p>
                        </div>
                        <div class="col">
                            <h6>Due-date</h6>
                            <p class="cardInfo">${response[i].due_date}</p>
                        </div>
                        <div class="col">
                            <h6>Status</h6>
                            <button data-id="${response[i].id}" class="btn btn-danger completeItem">Incomplete</button>
                        </div>

                        <div class="col deleteCol">
                            <!-- Button trigger modal -->
                            <i data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${response[i].id}" class="trashIcon fas fa-trash-alt"></i>
                        </div>
                    </div><!-- end row -->

                </div>
                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Action Confirmation</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete the task?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                <button data-id="${response[i].id}" type="button" class="deleteConfirm btn btn-primary">Yes, delete task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> `)//end el.append
            }//end if 
            else{
                el.append(`
                <div class="cardContainer col">
                    <div class="row">
                        <div class="col-4">
                            <h6>Task</h6>
                            <p class="complete cardInfo">${response[i].task}</p>
                        </div>
                        <div class="col">
                            <h6>Category</h6>
                            <p class="cardInfo">${response[i].category}</p>
                        </div>
                        <div class="col">
                            <h6>Due-date</h6>
                            <p class="cardInfo">${response[i].due_date}</p>
                        </div>
                        <div class="col">
                            <h6>Status</h6>
                            <button data-id="${response[i].id}" class="btn btn-success completeItem">complete</button>
                        </div>

                        <div class="col deleteCol">
                            <!-- Button trigger modal -->
                            <i data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${response[i].id}" class="trashIcon fas fa-trash-alt"></i>
                        </div>
                    </div>
                    <!-- Modal -->
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Action Confirmation</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Are you sure you want to delete the task?
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                    <button data-id="${response[i].id}" type="button" class="deleteConfirm btn btn-primary">Yes, delete task</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> `)//end el.append
            }//end else
        }//end for 
    }).catch(function(err){
        console.log('error! check consol for more details!');
    })
}//end getListItem


function addTask(){
    console.log( "in addTask" );
    let objectToSend={
        task: $(`#taskIn`).val(),
        //set catetory to the variable of category as earlier we set it to an empty string and then whatever category we clicked on on the DOM 
        category: category,
        due_date: $(`#dueDateIn`).val()
    }
    //if an input is missing, create an alert 
    if(objectToSend.task=== "" || objectToSend.category === "" || objectToSend.due_date === "" ){
        alert("One of more fields are empty")
    }
    //else, post the response 
    else{
        $.ajax({
            method: 'POST',
            url: '/todo',
            data: objectToSend
        }).then(function( response ){
            console.log( "success", response )
            getListItem();
            $('#taskIn').val('');
            //reset category variable to an empty string 
            category="";
            //set #dropdownCategory to an empty string 
            $('#dropdownCategory').empty();
            //append new #dropdownCategory 
            $('#dropdownCategory').append("select category");
            $('#dueDateIn').val('')
        }).catch(function(err){
            console.log("error! check consol for more details!")
        })
    }//end else 
}//end addTask


function deleteItem(){
    console.log('in deleteItem:', $(this).data( 'id' ) );
    $('#exampleModal').modal("hide");
    //make an AJAX DELETE call 
    $.ajax({
        method: 'DELETE',
        url: '/todo?id=' + $( this ).data( 'id' ),
    }).then( function( response ){
        //run getListItem to empty from DOM and refresh 
        getListItem()
        console.log( 'back from delete:', response );
    }).catch(function(err){
        alert( 'error with delete' );
        console.log( err );
    })
}

function completeItem(){
    console.log( 'in flagMessage:', $( this ).data( 'id' ) );
    $.ajax({
        method: 'PUT',
        url: '/todo?id=' + $( this ).data( 'id' ),
    }).then( function( response ){
        console.log( 'back from update:', response );
        getListItem();
    }).catch( function( err ){
        console.log( err );
        alert( 'error updating status' );
    })
}//end completeItem

//set category to an empty string
let category = "";
function addCategory(){
    console.log("in addCategory");
    console.log($(this).data().value);
    //set category equal to the clicked on value 
    category = $(this).data().value;
    let el = $('#dropdownCategory');
    el.empty();
    el.append(category);
}
