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
//= require codemirror/addons/hint/show-hint
//= require codemirror/addons/hint/xml-hint
//= require codemirror/addons/hint/html-hint
//= require codemirror/modes/xml
//= require codemirror/modes/htmlmixed
//= require vendor/tree
//= require vendor/resize-bs-grid
//= require vendor/bootstrap-dynamic-tabs
//= require_tree .

$(function() {
    window.openEditors = 0;
    $("#explorer").resizable();
    window.tabs = $("#editor_tabs").bootstrapDynamicTabs();
    $('#tree').treed({openedClass : 'fas fa-folder-open', closedClass : 'fas fa-folder'});
    $('#tree').height(window.outerHeight);
    $("#preview_content").height(window.outerHeight);

    $("#site_name").prev().addClass("purple-icon");
    $("#site_name").click();

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
        };
        $.post("/cms/layouts", { layout: data }, function(result) {
            SetEditor(result);
        });
    });

    $("body").on('blur', '#new-page-name', function() {
        var data = {
            name: $(this).html(),
            site_id: $("#current-site-id").html()
        };
        $.post("/cms/pages", { page: data }, function(result) {
            SetEditor(result);
        });
    });

    $("body").on("click", ".edit-file", function() {
        var kind = $(this).attr("data-kind");
        var id = $(this).attr("id");
        var url = "/cms/" + kind + "/" + id;
        $.get(url, function(result) {
            SetEditor(result);
        });
    });

    function SetEditor(result) {
        var height = $("#preview_content").height();
        var width = $("#preview_content").width();
        var id = constructTab(result.name);
        var editor = CodeMirror.fromTextArea(document.getElementById(id), {
            lineNumbers: true,
            mode: "text/html",
            htmlMode: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            theme: "material",
        });
        editor.setSize(width + 29, height - 29);
        editor.setValue(result.content);
        editor.on('change', editor => {
            // (editor.getValue());
        });
    }

    function constructTab(name) {
        var editorId = window.openEditors + 1;
        window.openEditors = editorId;
        var friendlyID = "code_" + editorId;
        var tabID = "tab_" + editorId;
        var body = "<textarea id=" + friendlyID + " \"class=d-none\"></textarea>\n";

        tabs.addTab({
            title: name,
            html: body,
            closable: true,
            ID: tabID
        });
        return friendlyID;
    }
});
