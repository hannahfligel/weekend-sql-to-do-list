$( document ).ready( onReady );

function onReady(){
    getListItem();
    $( '#addTaskButton' ).on( 'click', addTask );
    //target the parent id of the delete item
    $( '#todoOut1' ).on( 'click', '.trashIcon', deleteItem );
    $( '#todoOut1' ).on( 'click', '.completeItem', completeItem );
    $( '.categoryIn' ).on( 'click', addCategory );
    $( '#todoOut1' ).on( 'click', '.dropdown-item', setStatus);
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
        for(i=0; i<response.length; i++){
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
                        <i data-id="${response[i].id}" class="trashIcon fas fa-trash-alt"></i>
                    </div>
                </div>
            </div>
            </div> `)
            }//end if 
            else{
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
                    <button data-id="${response[i].id}" class="btn btn-success completeItem">complete</button>
                </div>
                <div class="col deleteCol">
                    <i data-id="${response[i].id}" class="trashIcon fas fa-trash-alt"></i>
                </div>
                </div>
            </div>
            </div> `)
            }//end else 
        //     //if the response is not complete 
        //     if(!response[i].complete){
        //         //append complete button
        //         el.append(`<tr>
        //         <td>${response[i].task}</td>
        //         <td>${response[i].category}</td>
        //         <td>${response[i].due_date}</td>
        //         <td><input type="button" class="btn btn-success completeItem" value="Complete" data-id="${response[i].id}"></td>
        //         <td><input type="button" class="deleteItem btn btn-danger" value="Delete" data-id="${response[i].id}"></td> 
        //       </tr>`)
        //     }//end if 
        //     else{
        //         el.append(`<tr>
        //         <td>${response[i].task}</td>
        //         <td>${response[i].category}</td>
        //         <td>${response[i].due_date}</td>
        //         <td class="table-success">completed</td>
        //         <td><input type="button" class="btn btn-danger deleteItem" value="Delete" data-id="${response[i].id}"></td> 
        //       </tr>`)
        //     }//end else 
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
}//end addTask


function deleteItem(){
    console.log('in deleteItem:', $(this).data( 'id' ) );
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

let todoStatus = "";
function setStatus(){
    console.log("in setStatus");
    console.log($(this).data().value);
    todoStatus = $(this).data().value; 
    completeItem();

}