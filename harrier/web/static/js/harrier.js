var Harrier = function() {
    var index = 0;
    var images = [];
    var width = 632;
    var height = 504;
    var canvas = null;
    var ctx = null;
    var readonly = true;
    var shape = 'circle';

    function init(id, curi, ro, sh) {
        index = curi;
        if(!ro) readonly = false;
        if(sh != 'circle') {
            shape = 'square';
        }

        canvas = document.getElementById('drop');
        ctx = canvas.getContext('2d');
        setWidth(width, height);

        if(!readonly) {
            canvas.addEventListener("mousedown", function(evt) {
                var pos = getPosition(evt);

                var x = pos.x / width;
                var y = pos.y / height;
                $.ajax({
                    url: '/data/image/'+images[index]+'/target/add',
                    type: "POST",
                    data: {'x': x, 'y': y},
                    success: function(data) {
                        drawTarget(pos.x,pos.y);
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
                $('#shape-circle').click(function() { setShape('circle') });
                $('#shape-square').click(function() { setShape('square') });
            }
        });

        $(window).resize(function() {
            resize(true);
        });
    }

    function setShape(sh) {
        shape = 'circle'
        if(sh != 'circle') {
            shape = 'square';
        }
        display(false);
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
                $('.modal').modal('hide');
                display(false);
            }
        });
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
                display(false);
            }
        });
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
                drawTarget(x,y);
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

    function drawTarget(x, y) {
        ctx.fillStyle = "rgba(255, 0, 0, .3)";
        ctx.beginPath();
        var sz = width*0.026
        if(shape == 'square') {
            ctx.rect(x-Math.round(sz/2),y-Math.round(sz/2), Math.round(sz), Math.round(sz));
        } else {
            ctx.arc(x, y, Math.round(sz), 0, Math.PI*2, true);
        }
        ctx.fill();
        ctx.closePath();
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
