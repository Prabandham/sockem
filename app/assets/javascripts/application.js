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
//= require jquery-fileupload/basic
//= require jquery-fileupload/vendor/tmpl
//= require_tree .

jQuery.each( [ "put", "delete" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});

$(function() {
    window.openEditors = 0;
    $(".cms-editor-grid").resizableGrid();
    window.tabs = $("#editor_tabs").bootstrapDynamicTabs();
    $('#tree').treed({openedClass : 'fas fa-folder-open', closedClass : 'fas fa-folder'});
    $('#tree').height(window.outerHeight);
    $("#preview_content").height(window.outerHeight);

    $("#site_name").prev().addClass("purple-icon");
    $("#site_name").click();

    window.setInterval(function(){
        saveAllEditors();
    }, 10000);

    $("#new-asset").on('click', function(e) {
        e.preventDefault();
    });

    $(".edit-asset").on("click", function(e) {
        alert("Show modal for setting priority and deleting asset");
    });

    $("#asset-upload").fileupload({
        dataType: "script",
        add: function(e, data) {
            var file, types;
            types = /(\.|\/)(gif|jpe?g|png|css|js|map)$/i;
            file = data.files[0];
            if (types.test(file.type) || types.test(file.name)) {
                data.context = $(tmpl("template-upload", file));
                $('#asset-progress').append(data.context);
                return data.submit();
            } else {
                return alert(file.name + " is not a gif, jpeg, png, css, js or map file");
            }
        },
        progress: function(e, data) {
            var progress;
            if (data.context) {
                progress = parseInt(data.loaded / data.total * 100, 10);
                return data.context.find('.bar').css('width', progress + '%');
            }
        },
        done: function (e, data) {
            window.location.reload();
        },
        fail: function(e, data) {
            alert("Something went worng in the upload");
            window.reload;
        }

    });

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
            SetEditor(result, "layouts");
        });
    });

    $("body").on('blur', '#new-page-name', function() {
        var data = {
            name: $(this).html(),
            site_id: $("#current-site-id").html()
        };
        $.post("/cms/pages", { page: data }, function(result) {
            SetEditor(result, "pages");
        });
    });

    $("body").on("click", ".edit-file", function() {
        var kind = $(this).attr("data-kind");
        var id = $(this).attr("id");
        var url = "/cms/" + kind + "/" + id;
        $.get(url, function(result) {
            SetEditor(result, kind);
        });
    });

    function SetEditor(result, kind) {
        var height = $("#preview_content").height();
        var width = $("#preview_content").width();
        var id = constructTab(result.name, result.id, kind);
        var content = result.content;
        if(content === null) {
            content = "";
        }
        var editor = CodeMirror.fromTextArea(document.getElementById(id), {
            lineNumbers: true,
            mode: "text/html",
            htmlMode: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            theme: "material",
        });
        editor.setSize(width + 29, height - 29);
        editor.setValue(content);
        editor.on('change', editor => {
            var textArea = $(editor.getTextArea());
            var id = textArea.attr("id").split("_")[1];
            var name = textArea.attr("attr-name");
            var tabId = "tab_" + id;
            var query = "a[href$=" + tabId + "]";
            var content = "<button class=\"close\" type=\"button\">x</button>\n" +
                name + "<span class='text-danger'>*</span>";
            $(query).html(content);
            textArea.val(editor.getValue());
        });
        $("#" + id).val(content);
    }

    $("body").on("click", ".close", function() {
        var element = $($(this).parent()[0]).attr("href").split("#")[1];
        tabs.closeById(element);
    });

    function constructTab(name, id, kind) {
        var friendlyID = "code_" + id + "_" + kind;
        var tabID = "tab_" + id + "_" + kind;
        var body = "<textarea id=" + friendlyID + " \"class=d-none\" attr-name=" + name + "></textarea>\n";

        window.tabs.addTab({
            title: name,
            html: body,
            closable: true,
            id: tabID
        });
        return friendlyID;
    }

    function saveAllEditors() {
        if($(".nav-tabs > li > a").length > 0) {
            $.each($(".nav-tabs > li > a"), function(i,tab_id) {
                var contentId = $(tab_id).attr("href");
                var regex = contentId + " > textarea";
                var textArea = $(regex);
                var name = textArea.attr("attr-name");
                var textAreaId = $(regex).attr("id");
                var elmID = textAreaId.split("_")[1];
                var data;
                var kind = textAreaId.split("_")[2];
                var url = "/cms/" + kind + "/" + elmID;
                if(kind == "pages") {
                    data = { page: { content: $(regex).val() } };
                } else {
                    data = { layout: { content: $(regex).val() } };
                }
                $.put(url, data, function(result) {
                    var tabId = contentId.split("#")[1];
                    var query = "a[href$=" + tabId + "]";
                    var content = "<button class=\"close\" type=\"button\">x</button>\n" +
                        name;
                    $(query).html(content);
                });
            });
        }
    }
});
