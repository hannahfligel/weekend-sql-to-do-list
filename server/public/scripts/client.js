$( document ).ready( onReady );

function onReady(){
    getListItem();
    $( '#addTaskButton' ).on( 'click', addTask );
    //target the parent id of the delete item
    $( '#todoOut' ).on( 'click', '.deleteItem', deleteItem );
    $( '#todoOut' ).on( 'click', '.completeItem', completeItem );
    $( '.categoryIn' ).on( 'click', addCategory );
}

function getListItem(){
    console.log("in getListItem");
    $.ajax({
        method: 'GET',
        url:'/todo'
    }).then(function(response){
        console.log('back from server:', response)
        el=$('#todoOut');
        el.empty();
        // append each todo item to DOM
        for(i=0; i<response.length; i++){
            //if the response is not complete 
            if(!response[i].complete){
                //append complete button
                el.append(`<tr>
                <td>${response[i].task}</td>
                <td>${response[i].category}</td>
                <td>${response[i].due_date}</td>
                <td><input type="button" class="btn btn-success completeItem" value="Complete" data-id="${response[i].id}"></td>
                <td><input type="button" class="deleteItem btn btn-danger" value="Delete" data-id="${response[i].id}"></td> 
              </tr>`)
            }//end if 
            else{
                el.append(`<tr>
                <td>${response[i].task}</td>
                <td>${response[i].category}</td>
                <td>${response[i].due_date}</td>
                <td class="table-success">completed</td>
                <td><input type="button" class="btn btn-danger deleteItem" value="Delete" data-id="${response[i].id}"></td> 
              </tr>`)
            }
        


                      //target id specifically in the data because they are unique characters
            // let appendString = `<tr>
            //     <td>${response[i].task}</td>
            //     <td>${response[i].category}</td>
            //     <td>${response[i].due_date}</td>`;

            // if(!response[i].completeItem){
            //     appendString+= `<td><input type="button" class="completeItem" value="Complete" data-id="${response[i].id}"></td>`;
            // }
            //     appendString+=`<td><input type="button" class="deleteItem" value="Delete" data-id="${response[i].id}"></td> 
            //         </tr>`;
            //     el.append( appendString );



            // el.append( 
            //     `<li><strong>Task: </strong>${response[i].task} <strong>Category: </strong>${response[i].category}<strong>Due date: </strong> ${response[i].due_date}
            //     <button class="deleteItem" data-id="${response[i].id}">Delete</button>
            //     <button class="completeItem" data-id="${response[i].id}">Complete</button></li>`
            // )
        }
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
        $(`#taskIn`).val('');
        $(`.categoryIn`).val(''),
        $(`#dueDateIn`).val('')
    }).catch(function(err){
        console.log("error! check consol for more details!")
    })
}//end addTask


function deleteItem(){
    console.log('in deleteItem:', $(this).data( 'id' ));
    //make an AJAX DELETE call 
    $.ajax({
        method: 'DELETE',
        url: '/todo?id=' + $( this ).data( 'id' )
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
        alert( 'error deleting message' );
    })
}//end completeItem

//set category to an empty string
let category = "";
function addCategory(){
    console.log("in addCategory");
    console.log($(this).data().value);
    //set category equal to the clicked on value 
    category = $(this).data().value;
}
