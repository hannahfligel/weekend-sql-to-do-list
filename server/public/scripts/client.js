$( document ).ready( onReady );

function onReady(){
    getListItem();
    $( '#addTaskButton' ).on( 'click', addTask );
    //target the parent id of the delete item
    $( '#todoOut' ).on( 'click', '.deleteItem', deleteItem );
    $( '.categoryIn' ).on( 'click', addCategory );
}

//set category to an empty string
let category = "";
function addCategory(){
    console.log("in addCategory");
    console.log($(this).data().value);
    //set category equal to the clicked on value 
    category = $(this).data().value;
}

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

function getListItem(){
    console.log("in getListItem");
$.ajax({method: 'GET',
        url:'/todo'
    }).then(function(response){
        console.log('back from server:', response)
        el=$('#todoOut');
        el.empty();

        for(i=0; i<response.length; i++){
            //target id specifically in the data because they are unique characters
            el.append( `<li><strong>Task: </strong>${response[i].task} <strong>Category: </strong>${response[i].category} 
            <strong>Due date: </strong> ${response[i].due_date}
            <button class="deleteItem" data-id="${response[i].id}">Delete</button></li>`)
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