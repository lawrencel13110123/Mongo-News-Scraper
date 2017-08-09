$(".view-btn").click(function() {
    $('html,body').animate({
        scrollTop: $("#view-articles").offset().top},
        'slow');
});

$(".comment-btn").click(function() {
	$("#comment-modal").modal("toggle")
});

