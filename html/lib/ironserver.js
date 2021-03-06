//http://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side/430240#430240
var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}


function deletePost(params){
	var post = document.getElementById("post_" +params.id);
	restore = post.innerHTML
	post.innerHTML = 'Confirm Delete?<br>';
	var confirm = document.createElement("a");
	confirm.setAttribute("href", "#");
	confirm.setAttribute("onclick", "confirmDelete({table:'"+params.table+"', id:'"+params.id+"'});")
	confirm.innerHTML = "Delete";
	post.appendChild(confirm);
	var decline = document.createElement("a");
	decline.setAttribute("href", params.table+".php");
	decline.innerHTML = "Cancel";
	var br = document.createElement("br");
	post.appendChild(br);
	post.appendChild(decline);
}

function confirmDelete(params) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "lib/post.php");

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "action");
	hiddenField.setAttribute("value", "delete");
	form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}
function label(name){
    var label = document.createElement("label");
    label.setAttribute("for", name);
    label.innerHTML = name+':';
    return label;
}

function textarea(name){
    var textarea = document.createElement("textarea");
    textarea.setAttribute("type", "textarea");
    textarea.setAttribute("name", name);
    return textarea;
}
function textbox(name){
    var textbox = document.createElement("input");
    textbox.setAttribute("type", "text");
    textbox.setAttribute("name", name);
    textbox.setAttribute("class", "textbox");
    return textbox;
}
function list(){
    var list = document.createElement("input");
    list.setAttribute("list", "users");
    list.setAttribute("name", "owner");
    return list
}

function datalist(){
    var datalist= document.createElement("datalist");
    datalist.setAttribute("id", "users");

    var i;
    for (i = 0; i < arguments.length; i++){
        var user= document.createElement("option");
        user.setAttribute("value", arguments[i]);
        datalist.appendChild(user);
    }
    return datalist;
}
function checklist(){
    var i;
    for (i = 0; i < arguments.length; i++){
        var user=document.createElement("checkbox");
        user.setAttribute("name", "users")
        user.setAttribute("value", arguments[i]);
        form.appendChild(user);
    }
}

function postid(id){
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "id");
    hiddenField.setAttribute("value", id);
    return hiddenField
}

function action(action){
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "action");
    hiddenField.setAttribute("value", action);
    return hiddenField
}

function submit(){
    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "submit");
    return submit;
}

function archive(table, id){
    if(confirm("Are you sure you want to archive this post?")==true){
    var form=document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "lib/post.php");

    form.appendChild(postid(id));
    form.appendChild(action("archive"));

    var hTable = document.createElement("input");
    hTable.setAttribute("type", "hidden");
    hTable.setAttribute("name", "table");
    hTable.setAttribute("value", table);
    form.appendChild(hTable);

    document.body.appendChild(form);
    form.submit();}
}
function newRule(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "rules.php");

    form.appendChild(label("title"));
    form.appendChild(textbox("title"));
    form.appendChild(label("note"));
    form.appendChild(textarea("note"));
    var i;
    for (i = 0; i < arguments.length; i++){
        var user=document.createElement("input");
        user.setAttribute("type", "checkbox");
        user.setAttribute("name", "users["+i+"]");
        user.setAttribute("value", arguments[i]);
        user.setAttribute("class", "checkbox");
        form.appendChild(user);
        var uname=document.createElement("label");
        uname.setAttribute("for", "users");
        uname.appendChild(document.createTextNode(arguments[i]));
        form.appendChild(uname);
    }
    form.appendChild(action("new"));
    form.appendChild(submit());

    var parent = document.getElementById("newform");
    parent.innerHTML = '';
    parent.appendChild(form);
}

function editRule(id, userlist){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "rules.php");

    var title=textbox("title");
    var note=textarea("note");

    form.appendChild(label("title"));
    form.appendChild(title);
    form.appendChild(label("note"));
    form.appendChild(note);
    var i=0;
    for (var key in userlist){
        var user=document.createElement("input");
        user.setAttribute("type", "checkbox");
        user.setAttribute("name", "users["+i+"]");
        i++;
        user.setAttribute("value", key);
        user.setAttribute("class", "checkbox");
        if(userlist[key]=='true'){
            user.checked=true;
        } else {
            user.checked=false;
        }
        form.appendChild(user);
        var uname=document.createElement("label");
        uname.setAttribute("for", "users");
        uname.appendChild(document.createTextNode(key));
        form.appendChild(uname);
    }
    form.appendChild(postid(id));
    form.appendChild(action("edit"));
    form.appendChild(submit());

    title.value = removeTags(document.getElementById("title_"+id).innerHTML);
    note.innerHTML = removeTags(document.getElementById("note_"+id).innerHTML);

    var parent = document.getElementById("post_"+id);
    parent.innerHTML = '';
    parent.appendChild(form);
}
function newDiary(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "diary.php");

    form.appendChild(label("title"));
    form.appendChild(textbox("title"));
    form.appendChild(label("content"));
    form.appendChild(textarea("content"));

    form.appendChild(action("new"));
    form.appendChild(submit());

    var parent = document.getElementById("newform");
    parent.innerHTML = '';
    parent.appendChild(form);
}
function editDiary(id){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "diary.php");

    var title=textbox("title");
    var content=textarea("content");

    form.appendChild(label("title"));
    form.appendChild(title);
    form.appendChild(label("content"));
    form.appendChild(content);
    form.appendChild(postid(id));
    form.appendChild(action("edit"));
    form.appendChild(submit());

    title.value = removeTags(document.getElementById("title_"+id).innerHTML);
    content.innerHTML = removeTags(document.getElementById("content_"+id).innerHTML);

    var parent = document.getElementById("post_"+id);
    parent.innerHTML = '';
    parent.appendChild(form);
}
function newStar(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "stars.php");

    form.appendChild(label("note"));
    form.appendChild(textarea("note"));
    form.appendChild(label("owner"));
    form.appendChild(list());
    form.appendChild(datalist.apply(this, arguments));

    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "submit");
    form.appendChild(submit);

    var parent = document.getElementById("newstar");
    parent.innerHTML = '';
    parent.appendChild(form);
}
function newReward(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "rewards.php");

    form.appendChild(label("title"));
    form.appendChild(textbox("title"));
    form.appendChild(label("note"));
    form.appendChild(textarea("note"));
    form.appendChild(label("cost"));
    form.appendChild(textarea("cost"));
    form.appendChild(label("image"));
    form.appendChild(textarea("image"));
    form.appendChild(label("link"));
    form.appendChild(textarea("link"));
    form.appendChild(label("owner"));
    form.appendChild(list());
    form.appendChild(datalist.apply(this, arguments));
    form.appendChild(action("new"));
    form.appendChild(submit());

    var parent = document.getElementById("newform");
    parent.innerHTML = '';
    parent.appendChild(form);
}

function editReward(id){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "rewards.php");

    var title=textbox("title");
    var note=textarea("note");
    var cost=textarea("cost");
    var image=textarea("image");
    var link=textarea("link");

    form.appendChild(label("title"));
    form.appendChild(title);
    form.appendChild(label("note"));
    form.appendChild(note);
    form.appendChild(label("cost"));
    form.appendChild(cost);
    form.appendChild(label("image"));
    form.appendChild(image);
    form.appendChild(label("link"));
    form.appendChild(link);
    form.appendChild(postid(id));
    form.appendChild(action("edit"));
    form.appendChild(submit());

    title.value = removeTags(document.getElementById("title_"+id).innerHTML);
    note.innerHTML = removeTags(document.getElementById("note_"+id).innerHTML);
    cost.innerHTML = removeTags(document.getElementById("cost_"+id).innerHTML);
    image.innerHTML = removeTags(document.getElementById("image_"+id).src);
    link.innerHTML = removeTags(document.getElementById("link_"+id).href);

    var parent = document.getElementById("post_"+id);
    parent.innerHTML = '';
    parent.appendChild(form);
}

function awardReward(id){
    if(confirm("Are you sure you want to award this post?")==true){
    var form=document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "rewards.php");

    form.appendChild(postid(id));
    form.appendChild(action("award"));

    document.body.appendChild(form);
    form.submit();
    }
}

function newNote(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "notes.php");

    form.appendChild(label("title"));
    form.appendChild(textbox("title"));
    form.appendChild(label("note"));
    form.appendChild(textarea("note"));
    form.appendChild(action("new"));
    form.appendChild(submit());

    var parent = document.getElementById("newform");
    parent.innerHTML = '';
    parent.appendChild(form);
}
function editNote(id){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "notes.php");

    var title=textbox("title");
    var note=textarea("note");

    form.appendChild(label("title"));
    form.appendChild(title);
    form.appendChild(label("note"));
    form.appendChild(note);
    form.appendChild(postid(id));
    form.appendChild(action("edit"));
    form.appendChild(submit());

    title.value = removeTags(document.getElementById("title_"+id).innerHTML);
    note.innerHTML = removeTags(document.getElementById("note_"+id).innerHTML);

    var parent = document.getElementById("post_"+id);
    parent.innerHTML = '';
    parent.appendChild(form);
}

function newGallery(){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "gallery.php");
    form.setAttribute("enctype", "multipart/form-data");
    var file = document.createElement("input");
    file.setAttribute("type", "file");
    file.setAttribute("name", "image_upload");
    file.setAttribute("id", "image_upload")
    form.appendChild(file);
    form.appendChild(action("new"));
    form.appendChild(submit());
    var parent = document.getElementById("newform");
    parent.innerHTML = '';
    parent.appendChild(form);
}

function editTimetable(id){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "timetable.php");
    var time=textarea("time");
    form.appendChild(label("time"));
    form.appendChild(time);
    form.appendChild(postid(id));
    form.appendChild(action("edit"));
    form.appendChild(submit());

    time.innerHTML = removeTags(document.getElementById("time_"+id).innerHTML);

    var parent = document.getElementById("time_"+id);
    parent.innerHTML = '';
    parent.appendChild(form);
}
