// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCguoe6bDJ7VFhypXifzuHmMj5PPk1I2mY",
    authDomain: "crud-d7389.firebaseapp.com",
    databaseURL: "https://crud-d7389-default-rtdb.firebaseio.com",
    projectId: "crud-d7389",
    storageBucket: "crud-d7389.appspot.com",
    messagingSenderId: "204690018229",
    appId: "1:204690018229:web:1c06c3135e1e1dd30753fc",
    measurementId: "G-VF1D4MVYV5"
  };
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    
    const db = firebase.database();
    coleccionProductos = db.ref().child('productos');
    bodyProductos = $('#bodyProductos').val();
    //console.log(bodyProductos);
    //console.log(coleccionProductos);
    $('#form1').submit(function(e){ //lo que va a hacer es el envio del formulario, como es id lleva el # que es para ids #form1
        e.preventDefault();
        let id = $('#id').val();
        let codigo = $('#codigo').val();
        let descripcion = $('#descripcion').val();
        let cantidad = $('#cantidad').val();

        let idFirebase = id; //al id  lo vamos asignar a una variable idFirebase, que todo ese numero que estamos trayendo ese num aleatorio que estamos viendo 
        if(idFirebase == ''){
            idFirebase = coleccionProductos.push().key;
        };

        data = {codigo:codigo, descripcion:descripcion, cantidad:cantidad};

        actualizacionData = {};

        actualizacionData[`/${idFirebase}`] = data;

        coleccionProductos.update(actualizacionData);
        id = '';
        $('#form1').trigger('reset');
        $('#modalNuevoedicion').modal('hide');
    });

    //los iconos de editar y borrar
    const iconoEditar = '<i class="material-icons">edit</i>'
    const iconoBorrar = '<i class="material-icons">delete</i>'
    //console.log("id: "+id); otra forma de hacere lo de abajo
    function mostrarProductos({codigo,descripcion,cantidad}){
        return `
        <td>${codigo}</td>
        <td>${descripcion}</td>
        <td>${cantidad}</td>
        <td>
            <button class="btn btn-secondary btn-sm btnEditar" data-toggle="tooltip" title="Editar">${iconoEditar}</button>
            <button class="btn btn-danger btn-sm btnBorrar" data-toggle="tooltip" title="Borrar">${iconoBorrar}</button>
        </td>
            `
    };
    //eventos de firebase
    //CHILD_ADDED -AGREGAMOS ALGO
    coleccionProductos.on('child_added', data => {
        let tr = document.createElement('tr')// tr son fila hacia la derecha y td para definir campos por fila
        tr.id = data.key
        tr.innerHTML =  mostrarProductos(data.val())
        document.getElementById('bodyProductos').appendChild(tr) //el id de tbody de table, estamos añadiendo un registro que estamos trayendo de firebase

    });

    //CHILD_CHANGED -MODIFICAMOS ALGO DE LA DB
    coleccionProductos.on('child_changed', data => {
        let nodoEditado = document.getElementById(data.key)
        nodoEditado.innerHTML = mostrarProductos(data.val())
    });

    //CHILD_REMOVES -BORRAMOS ALGO
    coleccionProductos.on('child_removed', data => {
        let nodoEditado = document.getElementById(data.key)
        document.getElementById('bodyProductos').removeChild(nodoEditado)
    });

    //programacion de los botones
    //boton Nuevo
    $('#btnNuevo').click(function(){
        $('#id').val('');
        $('#codigo').val('');
        $('#descripcion').val('');
        $('#cantidad').val('');
        $('#form1').trigger('reset');
        $('#modalNuevoedicion').modal('show');
    });
    //boton editar
    $('#tablaProductos').on('click', '.btnEditar', function(){
        let id = $(this).closest('tr').attr('id');
        let codigo =$(this).closest('tr').find('td:eq(0)').text();
        let descripcion =$(this).closest('tr').find('td:eq(1)').text();
        let cantidad =$(this).closest('tr').find('td:eq(2)').text();
        $('#id').val(id);
        $('#codigo').val(codigo);
        $('#descripcion').val(descripcion);
        $('#cantidad').val(cantidad);
        $('#modalNuevoedicion').modal('show');

    });
    //boton borrar
    $('#tablaProductos').on('click', '.btnBorrar', function(){
        Swal.fire({//con este codigo llamamos a sweetalert2
            title:'¿Esta seguro de borrar este registro?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Borrar'
        }).then((result) => {//si el result se confirma va a borrar
            if(result.value) {
               let id = $(this).closest('tr').attr('id');//capturamos el atributo id de ls fila
               db.ref(`productos/${id}`).remove();
               //le mostramos un mensaje sobre la eliminacion
               Swal.fire(
                   'Eliminado',
                   'El registro ha sido borrado.',
                   'success'
               )
            }
            
        })
    });




