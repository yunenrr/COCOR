$(document).ready(
  function(){
    // Se inicia un evento AJAX para obtener las empresas de la API.
    $.ajax(
      {
        type: "GET",
        url: "https://companiescr.azurewebsites.net/api/Company/",
        dataType: "json",
        beforeSend: function(){
          let divContainerProgress = document.createElement("div");
          divContainerProgress.setAttribute("class", "progress");
          let divProgress = document.createElement("div");
          divProgress.setAttribute("class", "progress-bar progress-bar-striped active");
          divProgress.setAttribute("role", "progressbar");
          divProgress.style.width = "100%";
          divProgress.innerHTML = "Loading...";
          divContainerProgress.append(divProgress);
          $("#allCompanies").prepend(divContainerProgress);
        },
        success: function(data){
          $(".progress").remove();
          // Se recorren los elementos del JSON.
          for (const position in data) {
            // Se valida que el JSON en dicha posición tenga un valor.
            if (data.hasOwnProperty(position)) {
              let row = document.createElement("tr"); // Se crea una fila.
              let colName = document.createElement("td"); // Se crea la columna nombre.
              colName.innerHTML = data[position].Name; // Se le agrega valor a la columna nombre.
              let colPage = document.createElement("td"); // Se crea la columna página.
              let linkPage = document.createElement("a"); // Se crea un link.
              linkPage.setAttribute("href", data[position].Url); // Se le agrega el href al link.
              linkPage.setAttribute("target", "_blank"); // Se le agrega el target al link.
              linkPage.text = data[position].Url; // Se le agrega texto al link.
              colPage.append(linkPage); // Se agrega el link a la columna página.
              let colOptions = document.createElement("td");
              let linkDelete = document.createElement("a");
              linkDelete.setAttribute("class", "btnOptionDelete btn btn-primary btn-sm btn-block");
              linkDelete.id = "btnDelete" + data[position].Id;
              linkDelete.text = "Delete";
              let linkUpdate = document.createElement("a");
              linkUpdate.setAttribute("class", "btnOptionUpdate btn btn-primary btn-sm btn-block");
              linkUpdate.setAttribute("data-toggle","modal");
              linkUpdate.setAttribute("data-target","#updateCompany");
              linkUpdate.id = "btnUpdate" + data[position].Id;
              linkUpdate.text = "Update";
              colOptions.append(linkDelete, linkUpdate);
              row.append(colName, colPage, colOptions); // Se agregan las columnas nombre y página a la fila.
              $("tbody").append(row); // Se agrega la fila al cuerpo de la tabla.
            }// Fin del if.
          }// Fin del for.
        }, // Fin del success.
        error: function(data){
          $(".progress").remove();
          let div = document.createElement("div");
          div.setAttribute("class", "alert alert-danger alert-dismissable");
          let link = document.createElement("a");
          link.setAttribute("class", "close");
          link.setAttribute("data-dismiss", "alert");
          link.setAttribute("aria-label", "close");
          let strong = document.createElement("strong");
          strong.innerHTML = "Error!";
          let paragraph = document.createElement("p");
          paragraph.innerHTML = "At this time it was not possible to connect to the database.";
          link.innerHTML = "&times;";
          div.append(link, strong, paragraph);
          $("#allCompanies").prepend(div);
        }// Fin del error.
      }
    ); // Fin del AJAX.

    // Se agrega el evento a la caja de texto search.
    $("#txtSearch").on("keyup",
      function(){
        let value = $(this).val().toLowerCase();
        $("#tbCompany tr").filter(
          function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
          }
        );
      }
    ); // Fin del evento.

    // Se agrega el escuchador de eventos al botón de actualizar creado dinámicamente.
    $("tbody").on("click", "a.btnOptionUpdate", 
      function(){
        let buttonId = $(this).attr('id');
        let companieId = buttonId.substring(9,buttonId.lenght);
        
        // Abrimos AJAX para obtener la información de la empresa.
        $.ajax(
          {
            type: "GET",
            url: "https://companiescr.azurewebsites.net/api/Company?id="+companieId,
            success: function(data){
              $("input[name=txtId]").val(data.Id);
              $("#name").val(data.Name);
              $("#url").val(data.Url);
            }, // Fin del success.
            error: function(data){
              let div = document.createElement("div");
              div.setAttribute("class", "alert alert-danger alert-dismissable");
              let link = document.createElement("a");
              link.setAttribute("class", "close");
              link.setAttribute("data-dismiss", "alert");
              link.setAttribute("aria-label", "close");
              let strong = document.createElement("strong");
              strong.innerHTML = "Danger!";
              let paragraph = document.createElement("p");
              paragraph.innerHTML = "At this time it was not possible to connect to the database.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#divBodyModal").prepend(div);
            }// Fin del error.
          }
        );//Fin del AJAX.
      }// Fin de la función interna.
    );// Fin del evento.

    // Evento al submit del formulario agregar empresas.
    $("#formUpdateCompany").submit(
      function(){
        $.ajax(
          {
            type: "PUT",
            url: "https://companiescr.azurewebsites.net/api/Company/",
            data: {"id":$("input[name=txtId]").val(),"name":$("#name").val(),"url":$("#url").val()},
            success: function(data){
              let div = document.createElement("div");
              div.setAttribute("class", "alert alert-success alert-dismissable");
              let link = document.createElement("a");
              link.setAttribute("class", "close");
              link.setAttribute("data-dismiss", "alert");
              link.setAttribute("aria-label", "close");
              let strong = document.createElement("strong");
              strong.innerHTML = "Success!";
              let paragraph = document.createElement("p");
              paragraph.innerHTML = "The company was update. To see the change, refresh the page.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#divBodyModal").prepend(div);
            }, // Fin del success.
            error: function(data){
              let div = document.createElement("div");
              div.setAttribute("class", "alert alert-danger alert-dismissable");
              let link = document.createElement("a");
              link.setAttribute("class", "close");
              link.setAttribute("data-dismiss", "alert");
              link.setAttribute("aria-label", "close");
              let strong = document.createElement("strong");
              strong.innerHTML = "Danger!";
              let paragraph = document.createElement("p");
              paragraph.innerHTML = "Verify that the page doens't exist.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#divBodyModal").prepend(div);
            }// Fin del error.
          }
        );//Fin del AJAX.
        return false;
      }
    );// Fin del evento.

    // Se agrega el escuchador de eventos al botón de eliminar creado dinámicamente.
    $("tbody").on("click", "a.btnOptionDelete", 
      function(){
        let buttonId = $(this).attr('id');
        let companieId = buttonId.substring(9,buttonId.lenght);
        $(this).closest('tr').remove(); // Elimina la fila dónde está ubicado el botón.
        
        // Abrimos AJAX para obtener la información de la empresa.
        $.ajax(
          {
            type: "DELETE",
            url: "https://companiescr.azurewebsites.net/api/Company?id="+companieId,
            success: function(data){
              let div = document.createElement("div");
              div.setAttribute("class", "alert alert-success alert-dismissable");
              let link = document.createElement("a");
              link.setAttribute("class", "close");
              link.setAttribute("data-dismiss", "alert");
              link.setAttribute("aria-label", "close");
              let strong = document.createElement("strong");
              strong.innerHTML = "Success!";
              let paragraph = document.createElement("p");
              paragraph.innerHTML = "The company was delete.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#allCompanies").prepend(div);
            }, // Fin del success.
            error: function(data){
              let div = document.createElement("div");
              div.setAttribute("class", "alert alert-danger alert-dismissable");
              let link = document.createElement("a");
              link.setAttribute("class", "close");
              link.setAttribute("data-dismiss", "alert");
              link.setAttribute("aria-label", "close");
              let strong = document.createElement("strong");
              strong.innerHTML = "Danger!";
              let paragraph = document.createElement("p");
              paragraph.innerHTML = "At this time it was not possible to connect to the database.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#allCompanies").prepend(div);
            }// Fin del error.
          }
        );//Fin del AJAX.
      }// Fin de la función interna.
    );// Fin del evento.
  }//Fin de la función principal
);