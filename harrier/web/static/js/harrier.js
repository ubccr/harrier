var Harrier = function() {
    var index = 0;
    var images = [];
    var width = 432;
    var height = 304;
    var canvas = null;
    var ctx = null;

    function init(id, curi) {
        index = curi;
        canvas = document.getElementById('drop');
        ctx = canvas.getContext('2d');
        setWidth(width, height);

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
                $('#results').click(results);
                $('#zoomin').click(zoomin);
                $('#zoomout').click(zoomout);
                $('#prev').click(prev);
                $('#next').click(next);
                $('#save-cat').click(saveCategory);
            }
        });
    }

    function setWidth(w, h) {
        canvas.width = w;
        canvas.height = h;
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

    function results() {
        window.location.href = '/image/'+images[index];
    }

    function zoomin() {
        width += 50;
        height += 50;
        setWidth(width, height);
        display();
    }

    function zoomout() {
        width -= 50;
        height -= 50;
        setWidth(width, height);
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
        ctx.clearRect(0, 0, width, height);
        var img = new Image();
        img.src = idata.url;
        img.width = width;
        img.height = height;
        img.onload = function(){
            ctx.drawImage(img, 0, 0, img.width, img.height);
            $.each(idata.targets, function(index, t) {
                var x = t.x * width;
                var y = t.y * height;
                drawCircle(x,y);
            });
        }

        $(".image-name").text(idata.name);
        $("#cat").val(idata.category);
        if(idata.category && idata.category.length > 0) {
            $("#cat-label").text(idata.category);
        } else {
            $("#cat-label").text('Classify');
        }
        var pct = Math.round((index/(images.length-1))*100)
        $('.progress-bar').css('width', pct+'%').attr('aria-valuenow', index).text((index+1)+' of '+images.length)
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
