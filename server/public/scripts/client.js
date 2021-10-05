$( document ).ready( onReady );

function onReady(){
    getListItem();
    $( '#addTaskButton' ).on( 'click', addTask );
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
            el.append( `<li><strong>Task: </strong>${response[i].task} <strong>Category: </strong>${response[i].category} <strong>Due date: </strong> ${response[i].due_date}</li>`)
        }
    }).catch(function(err){
        console.log('nope');
    })
}//end getListItem


function addTask(){
    console.log( "in addTask" );
    let objectToSend={
        task: $(`#taskIn`).val(),
        category: $(`#categoryIn`).val(),
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
        $(`#categoryIn`).val(''),
        $(`#dueDateIn`).val('')
    }).catch(function(err){
        console.log("error! check consol for more details!")
    })
}//end addTask