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
//= require htmlhint
//= require codemirror/addons/hint/show-hint
//= require codemirror/addons/hint/xml-hint
//= require codemirror/addons/hint/html-hint
//= require codemirror/addons/hint/css-hint
//= require codemirror/addons/dialog/dialog
//= require codemirror/addons/search/jump-to-line
//= require codemirror/addons/search/search
//= require codemirror/addons/search/searchcursor
//= require codemirror/addons/search/match-highlighter
//= require codemirror/addons/search/matchesonscrollbar
//= require codemirror/addons/scroll/annotatescrollbar
//= require codemirror/addons/lint/lint
//= require codemirror/addons/lint/html-lint
//= require codemirror/addons/fold/foldcode
//= require codemirror/addons/fold/foldgutter
//= require codemirror/addons/fold/brace-fold
//= require codemirror/addons/fold/xml-fold
//= require codemirror/addons/fold/indent-fold
//= require codemirror/addons/fold/markdown-fold
//= require codemirror/addons/fold/comment-fold
//= require codemirror/addons/edit/closetag
//= require codemirror/addons/edit/closebrackets
//= require codemirror/addons/edit/matchbrackets
//= require codemirror/addons/edit/matchtags
//= require codemirror/addons/edit/trailingspace
//= require codemirror/addons/selection/active-line
//= require codemirror/addons/selection/mark-selection
//= require codemirror/modes/xml
//= require codemirror/modes/javascript
//= require codemirror/modes/css
//= require codemirror/modes/htmlmixed
//= require vendor/tree
//= require vendor/resize-bs-grid
//= require vendor/bootstrap-dynamic-tabs
//= require vendor/jsoneditor.min
//= require jquery-fileupload/basic
//= require jquery-fileupload/vendor/tmpl
//= require clipboard
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
    $('.clipboard-btn').tooltip({
        trigger: 'click',
        placement: 'bottom'
    });
    function setTooltip(btn, message) {
        $(btn).tooltip('show')
            .attr('data-original-title', message)
            .tooltip('show');
    }

    function hideTooltip(btn) {
        setTimeout(function() {
            $(btn).tooltip('hide');
        }, 1000);
    }
    var clipboard = new Clipboard('.clipboard-btn');
    clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
    });

    clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
    });

    $('#tree').treed({openedClass : 'fas fa-folder-open opened', closedClass : 'fas fa-folder closed'});
    $('#tree').height(window.outerHeight);
    $('#tree').css({
      'height': '100%',
      'overflow': 'scroll',
      'position': 'fixed',
      'width': '100%',
      'padding-bottom': '50px',
      'background': 'rgb(44, 44, 44)'
    })
    $("#preview_content").height(window.innerHeight);
    

    $("#site_name").prev().addClass("purple-icon");
    $("#site_name").click();

    // window.setInterval(function(){
    //     saveAllEditors();
    // }, 10000);
  
  window.current_site_id = $("#current-site-id").text().trim();

  $(document).keydown(function(e) {
    if ((e.key == 's' || e.key == 'S' ) && (e.ctrlKey || e.metaKey))
    {
      e.preventDefault();
      saveAllEditors();
      return false;
    }
    return true;
  });

  $("#new-asset").on('click', function(e) {
        e.preventDefault();
    });

    // $(".edit-asset").on("click", function(e) {
    //     e.preventDefault();
    // });

    $("#asset-upload").fileupload({
        dataType: "script",
        add: function(e, data) {
            var file, types;
            types = /(\.|\/)(gif|jpe?g|png|svg|css|js|map)$/i;
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
            window.location.reload();
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

    $("#new-js").on('click', function(e) {
      e.preventDefault();
      var element = $("<li contenteditable='true' id='new-asset-name'>New JS Name</li>");
      var ul = $("#js-ul li:first");
      $(element).insertAfter(ul);
    });

    $("#new-css").on('click', function(e) {
      e.preventDefault();
      var element = $("<li contenteditable='true' id='new-asset-name'>New CSS Name</li>");
      var ul = $("#css-ul li:first");
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

    $("body").on("blur", "#new-asset-name", function() {
      var data = {
        name: $(this).html(),
        site_id: $("#current-site-id").html()
      };
      $.post("/cms/custom-assets", { asset: data }, function(result) {
        SetEditor(result, "assets");
      });
    });

  $("body").on("click", ".edit-file", function() {
    var kind = $(this).attr("data-kind");
    var id = $(this).attr("id");
    var url = "/cms/" + kind + "/" + id + ".json";

    if ($('#AssetEditModal').is(':visible')) {
      $("#AssetEditModal").modal('toggle');
    };

    $.get(url, function(result) {
      SetEditor(result, kind);
    });
  });

    // CodeMirror HTMLHint Integration
    (function(mod) {
        if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
        else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
        else // Plain browser env
        mod(CodeMirror);
    });

    (function(CodeMirror) {
        "use strict";

        CodeMirror.registerHelper("lint", "html", function(text) {
        var found = [], message;
        if (!window.HTMLHint) return found;
        var messages = HTMLHint.verify(text, ruleSets);
        for ( var i = 0; i < messages.length; i++) {
            message = messages[i];
            var startLine = message.line -1, endLine = message.line -1, startCol = message.col -1, endCol = message.col;
            found.push({
            from: CodeMirror.Pos(startLine, startCol),
            to: CodeMirror.Pos(endLine, endCol),
            message: message.message,
            severity : message.type
            });
        }
        return found;
        });
    });

    // ruleSets for HTMLLint
    let ruleSets = {
      "tagname-lowercase": true,
      "attr-lowercase": true,
      "attr-value-double-quotes": true,
      "doctype-first": true,
      "tag-pair": true,
      "spec-char-escape": true,
      "id-unique": true,
      "src-not-empty": true,
      "attr-no-duplication": true
    };

    function SetEditor(result, kind) {
        var height = $("#preview_content").height();
        var width = $("#preview_content").width();
        var id = constructTab(result.name, result.id, kind);
        var content = result.content;
        if(content === null || content === undefined) {
            content = "";
        }
        let mode_extension = result.name.split('.')[1];
        let mode;
        let indentUnit;
        if (mode_extension === "js") {
          mode = "javascript";
          indentUnit = 2;
        } else if (mode_extension === "css") {
          mode = "text/css";
          indentUnit = 2;
        } else if (mode_extension === "html") {
          mode = "text/html";
          indentUnit = 4;
        } else {
          mode = "text/htmlmixed";
          indentUnit = 4;
        }
        var editor = CodeMirror.fromTextArea(document.getElementById(id), {
            lineNumbers: true,
            mode: mode,
            tabMode: "indent",
            styleActiveLine: true,
            lineWrapping: true,
            autoCloseTags: true,
            indentUnit: indentUnit,
            autoCloseBrackets: true,
            matchTags: { bothTags: true },
            lint: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
            htmlMode: true,
            theme: "monokai",
            showTrailingSpace: true,
            extraKeys: {
              "Shift-Tab": autoFormatSelection,
              "Ctrl-Space": "autocomplete",
              "Alt-F": "findPersistent"
            },
        });

        function getSelectedRange() {
          return { from: editor.getCursor(true), to: editor.getCursor(false) };
        }

        function autoFormatSelection() {
          var range = getSelectedRange();
          editor.autoFormatRange(range.from, range.to);
        }

        editor.setSize(width + 29, height - 29);
        editor.setValue(content);
        editor.on('change', editor => {
            var textArea = $(editor.getTextArea());
            var id = textArea.attr("id").split("_")[1];
            var name = textArea.attr("attr-name");
            var tabId = "tab_" + id + "_" + kind;
            var query = "a[href$=" + tabId + "]";
            var content = "<button class=\"close\" type=\"button\">x</button>\n" +
                name + "<span class='text-danger'>*</span>";
            $(query).html(content);
            textArea.val(editor.getValue());
        });
        $("#" + id).val(content);
    }

    $("body").on("click", ".close", function() {
        var element;
        try {
            element = $($(this).parent()[0]).attr("href").split("#")[1];
        }
        catch(err) {
            element = null;
        }
        if(element != null) {
            tabs.closeById(element);
        }
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

    $(document).on('ajax:success', '#asset-update', event => {
      const [response, status, xhr] = event.detail;
      $("#AssetEditModal").modal('toggle');
    });
    $(document).on('ajax:success', '#layout-update', event => {
      const [response, status, xhr] = event.detail;
      $("#AssetEditModal").modal('toggle');
    });
    $(document).on('ajax:success', '#page-update', event => {
      const [response, status, xhr] = event.detail;
      $("#AssetEditModal").modal('toggle');
    });

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
                if(kind === "pages") {
                    data = { page: { content: $(regex).val() } };
                } else if (kind === "layouts") {
                    data = { layout: { content: $(regex).val() } };
                } else {
                  data = { asset: { content: $(regex).val(), name: name } };
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

    // Set json editor for meta field in sites form
    var meta_element = document.getElementById("site_meta_holder");
    if (meta_element !== null) {
        var schema = JSON.parse($("#site_meta").val());
        var editor = new JSONEditor(meta_element, {
            ajax: false,
            theme: 'bootstrap4',
            schema: {}
        });

        editor.setValue(schema);

        editor.on('change',function() {
            var value = editor.getValue();
            $("#site_meta").val(JSON.stringify(value));
        });
    }
});
