var Harrier = function() {
    var index = 0;
    var images = [];
    var width = 632;
    var height = 504;

    function init(id, curi) {
        index = curi;
        $.ajax({
            url: '/data/imageset/'+id,
            type: "GET",
            dataType: "json",
            success: function(data) {
                $.each(data.images, function(idx, i) {
                    images.push(i.id);
                });
                display();
                $('#reset').click(reset);
                $('#prev').click(prev);
                $('#next').click(next);
                $('#save-cat').click(saveCategory);
            }
        });
    }

    function next() {
        index++;
        if(index > images.length-1) {
            index = 0;
        }
        display();
    }

    function prev() {
        index--;
        if(index < 0) {
            index = images.length - 1;
        }
        display();
    }

    function saveCategory() {
        $.ajax({
            url: '/data/image/'+images[index]+'/category',
            type: "POST",
            data: {'cat': $('#cat').val()},
            success: function(data) {
            }
        });
        $('.modal').modal('hide');
        display();
    }

    function reset() {
        $.ajax({
            url: '/data/image/'+images[index]+'/target/del',
            type: "DELETE",
            success: function(data) {
            }
        });
        display();
    }

    function display() {
        $.ajax({
            url: '/data/image/'+images[index],
            type: "GET",
            dataType: "json",
            success: function(data) {
                displayImage(data);
            }
        });
    }

    function displayImage(idata) {
        $("#image-slider .caption").width(width);
        var canvas = document.getElementById('drop');
        canvas.width = width;
        canvas.height = height;
        canvas.addEventListener("mousedown", getPosition, false);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        var img = new Image();
        img.src = idata.url;
        img.width = width;
        img.height = height;
        img.onload = function(){
            ctx.drawImage(img,0,0, img.width, img.height);
            $.each(idata.targets, function(index, t) {
                drawCircle(t.x,t.y);
            });
        }

        $("#image-name").text(idata.name);
        $("#cat").val(idata.category);
        var pct = Math.round((index/(images.length-1))*100)
        $('.progress-bar').css('width', pct+'%').attr('aria-valuenow', index).text((index+1)+' of '+images.length)
    }

    function drawCircle(x, y) {
        var canvas = document.getElementById('drop');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(255, 0, 0, .3)";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

    // http://miloq.blogspot.com/2011/05/coordinates-mouse-click-canvas.html
    function getPosition(event) {
        var x = new Number();
        var y = new Number();
        var canvas = document.getElementById("drop");

        if (event.x != undefined && event.y != undefined) {
            x = event.x;
            y = event.y;
        }
        else  { // Firefox method to get the position
            x = event.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        drawCircle(x,y);
        $.ajax({
            url: '/data/image/'+images[index]+'/target/add',
            type: "POST",
            data: {'x': x, 'y': y},
            success: function(data) {
            }
        });
    }

    return {
        init: init
    }
}();
