// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery3
//= require vendor/jquery-ui.min
//= require popper
//= require bootstrap
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require codemirror
//= require codemirror/modes/ruby
//= require vendor/tree
//= require vendor/resize-bs-grid
//= require_tree .

$(function() {
    $('.cms-editor-grid').resizableGrid();
    $('#tree').treed({openedClass : 'fas fa-folder-open', closedClass : 'fas fa-folder'});
    $('#tree').height(window.outerHeight);
    $("#preview_content").height(window.outerHeight);

    $("#site_name").prev().addClass("purple-icon");

    $("#new-layout").on('click', function(e) {
        e.preventDefault();
        var element = $("<li contenteditable='true' id='new-layout-name'>New Layout Name</li>");
        var ul = $("#layouts-ul li:first");
        $(element).insertAfter(ul);
    });

    $("#new-page").on('click', function(e) {
        e.preventDefault();
        var element = $("<li contenteditable='true' id='new-page-name'>New Page Name</li>");
        var ul = $("#pages-ul li:first");
        $(element).insertAfter(ul);
    });

    $("body").on('blur', '#new-layout-name', function() {
        var data = {
            name: $(this).html(),
            site_id: $("#current-site-id").html()
        }
        $.post("/cms/layouts", { layout: data }, function(result) {
            CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                mode: "html",
                theme: "material",
                value: result.content,
            });
        });
    });

    $("body").on('blur', '#new-page-name', function() {
        var data = {
            name: $(this).html(),
            site_id: $("#current-site-id").html()
        }
        $.post("/cms/pages", { page: data }, function(result) {
            CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                mode: "html",
                theme: "material",
                value: result.content,
            });
        });
    });

    $("body").on("click", ".edit-file", function() {
        var kind = $(this).attr("data-kind");
        var id = $(this).attr("id");
        var url = "/cms/" + kind + "/" + id;
        $.get(url, function(result) {
            // Create a form and append to html of the content.
            // Then set the editor to the content of that form
            CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true,
                mode: "html",
                theme: "material",
            }).setValue(result.content);
        });
    });
});
