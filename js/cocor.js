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
              row.append(colName, colPage); // Se agregan las columnas nombre y página a la fila.
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

    // Se le agrega el evento al botón de imprimir.
    $("#btnPrint").click(
      function(){
        let doc = new jsPDF();
        let totalPagesExp = "{total_pages_count_string}";

        let pageContent = function (data) {
          // HEADER
          doc.setFontSize(20);
          doc.setTextColor(40);
          doc.setFontStyle('normal');
          doc.text("ICT Companies in Costa Rica", 60, 22);

          // FOOTER
          doc.setFontSize(10);
          doc.text("Yunen Ramos R. - My profile: https://www.linkedin.com/in/yunenrr/", data.settings.margin.left, doc.internal.pageSize.height - 10);
        };

        // Add the table.
        let table = document.getElementById("tableCompanies");
        let result = doc.autoTableHtmlToJson(table);
        doc.autoTable(result.columns, result.data, {
          addPageContent: pageContent,
          margin: {top: 30},
          styles: {overflow: 'linebreak'}
        });
        doc.save('ict-companies-cr.pdf');
      }// Fin de la función.
    ); // Fin del evento.

    // Evento al submit del formulario agregar empresas.
    $("#formAddCompany").submit(
      function(){
        $.ajax(
          {
            type: "POST",
            url: "https://companiescr.azurewebsites.net/api/Company/",
            data: {"name":$("#name").val(),"url":$("#url").val()},
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
              paragraph.innerHTML = "The company was added.";
              link.innerHTML = "&times;";
              div.append(link, strong, paragraph);
              $("#divBodyModal").prepend(div);

              // Se agrega a la tabla.
              let row = document.createElement("tr"); // Se crea una fila.
              let colName = document.createElement("td"); // Se crea la columna nombre.
              colName.innerHTML = $("#name").val(); // Se le agrega valor a la columna nombre.
              let colPage = document.createElement("td"); // Se crea la columna página.
              let linkPage = document.createElement("a"); // Se crea un link.
              linkPage.setAttribute("href", $("#url").val()); // Se le agrega el href al link.
              linkPage.setAttribute("target", "_blank"); // Se le agrega el target al link.
              linkPage.text = $("#url").val(); // Se le agrega texto al link.
              colPage.append(linkPage); // Se agrega el link a la columna página.
              row.append(colName, colPage); // Se agregan las columnas nombre y página a la fila.
              $("tbody").append(row); // Se agrega la fila al cuerpo de la tabla.
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
        return false;
      }
    );// Fin del evento.
  }//Fin de la función principal
);