var Harrier = function() {
    var index = 0;
    var images = [];
    var width = 600;
    var height = 500;
    var canvas = null;
    var ctx = null;
    var readonly = true;

    function init(id, curi, ro) {
        index = curi;
        if(!ro) readonly = false;

        canvas = document.getElementById('drop');
        ctx = canvas.getContext('2d');
        setWidth(width, height);

        if(!readonly) {
            canvas.addEventListener("mousedown", function(evt) {
                var pos = getPosition(evt);

                drawCircle(pos.x,pos.y);
                var x = pos.x / width;
                var y = pos.y / height;
                $.ajax({
                    url: '/data/image/'+images[index]+'/target/add',
                    type: "POST",
                    data: {'x': x, 'y': y},
                    success: function(data) {
                    }
                });
            }, false);
        }

        $.ajax({
            url: '/data/imageset/'+id,
            type: "GET",
            dataType: "json",
            success: function(data) {
                $.each(data.images, function(idx, i) {
                    images.push(i.id);
                });
                display(true);
                $('#reset').click(reset);
                $('#results').click(results);
                $('#zoomin').click(zoomin);
                $('#zoomout').click(zoomout);
                $('#zoomreset').click(function() { display(true) });
                $('#prev').click(prev);
                $('#next').click(next);
                $('#save-cat').click(saveCategory);
            }
        });

        $(window).resize(function() {
            resize(true);
        });
    }

    function setWidth(w, h) {
        width = w;
        height = h;
        canvas.width = w;
        canvas.height = h;
    }

    function next() {
        index++;
        if(index > images.length-1) {
            index = 0;
        }
        display(false);
    }

    function prev() {
        index--;
        if(index < 0) {
            index = images.length - 1;
        }
        display(false);
    }

    function saveCategory() {
        if(readonly) return;

        $.ajax({
            url: '/data/image/'+images[index]+'/category',
            type: "POST",
            data: {'cat': $('#cat').val()},
            success: function(data) {
            }
        });
        $('.modal').modal('hide');
        display(false);
    }

    function results() {
        window.location.href = '/image/'+images[index];
    }

    function zoomin() {
        width += 50;
        height += 50;
        setWidth(width, height);
        display(false);
    }

    function zoomout() {
        width -= 50;
        height -= 50;
        setWidth(width, height);
        display(false);
    }

    function reset() {
        if(readonly) return;
        $.ajax({
            url: '/data/image/'+images[index]+'/target/del',
            type: "DELETE",
            success: function(data) {
            }
        });
        display(false);
    }

    function display(reset_size) {
        $.ajax({
            url: '/data/image/'+images[index],
            type: "GET",
            dataType: "json",
            success: function(data) {
                displayImage(data, reset_size);
            }
        });
    }

    function resize(redraw) {
        var max_width = Math.floor($(window).width() * 0.70);
        if(width > max_width) {
            var diff = width - max_width;
            setWidth(width-diff, height-diff);
        } else if(width < max_width) {
        //    var diff = max_width - width;
         //   setWidth(width+diff, height+diff);
        }
        if(redraw) {
            display(false);
        }
    }

    function displayImage(idata, reset_size) {
        var img = new Image();
        img.src = idata.url;
        img.onload = function(){
            if(reset_size) {
                setWidth(img.width, img.height);
                resize(false);
            }
            ctx.clearRect(0, 0, width, height);
            img.width = width;
            img.height = height;

            ctx.drawImage(img, 0, 0, img.width, img.height);
            $.each(idata.targets, function(index, t) {
                var x = t.x * width;
                var y = t.y * height;
                drawCircle(x,y);
            });
        }

        $("#image-name").text(idata.name);
        $("#cat").val(idata.category);
        if(idata.category && idata.category.length > 0) {
            $("#cat-label").html('<i class="fa fa-folder-o"></i> '+idata.category);
        } else {
            $("#cat-label").text('');
        }
        var pct = Math.round((index/(images.length-1))*100)
        $("#image-progress").text('Showing image: '+(index+1)+' of '+images.length);
    }

    function drawCircle(x, y) {
        ctx.fillStyle = "rgba(255, 0, 0, .3)";
        ctx.beginPath();
        ctx.arc(x, y, Math.round(width*0.02), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

    function getPosition(evt) {
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;

        return {'x': x, 'y': y};
    }

    return {
        init: init
    }
}();
