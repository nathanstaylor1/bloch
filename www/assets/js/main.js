$(document).ready(function(){

	var windowData = {
		vw: $(window).width(),
		vh: $(window).height(),
		xAmount: 0,
		yAmount: 0,		
		xFromCenter: -1,
		yFromCenter: -1,
		xShift: true,
		yShift: true,
		xPositiveBefore: true,
		yPositiveBefore: true,
		xPositiveAfter: false,
		yPositiveAfter: false,

	}
	generateGrids();
	addSides();
	drawBlochs(windowData);
	manageMouse(windowData);
	fixZ(windowData);
	manageBlochs();
	manageScroll(windowData);

	console.log('blochCount', $(".bloch").length);

})



function addSides(){

	var sidesMarkup = "<div class='bloch-parts'>";
	sidesMarkup += "<span class='face'></span>";
	sidesMarkup += "<span class='side top-bottom'></span>";
	sidesMarkup += "<span class='side left-right'></span>";
	sidesMarkup += "</div>";

	var faceMarkup = "<div class='bloch-parts'>";
	faceMarkup += "<span class='face'></span>";
	faceMarkup += "</div>";

	$('.bloch').append(sidesMarkup);
	$('.bloch-outline').append(faceMarkup);

}

function manageMouse(windowData){


	$(window).on('resize', function(){

		windowData.vw = $(window).width();
		windowData.vh = $(window).height();

	});

	$(window).on('scroll', function(){ manageScroll(windowData); });

	$(window).on('mousemove', function(event){

		windowData.xAmount = event.clientX / windowData.vw;
		windowData.yAmount = event.clientY / windowData.vh;

		windowData.xPositiveBefore = windowData.xFromCenter >= 0;
		windowData.yPositiveBefore = windowData.yFromCenter >= 0;

		windowData.xFromCenter = (event.clientX - (windowData.vw / 2)) / windowData.vw * 2;
		windowData.yFromCenter = (event.clientY - (windowData.vh / 2)) / windowData.vh * 2;

		windowData.xPositiveAfter = windowData.xFromCenter >= 0;
		windowData.yPositiveAfter = windowData.yFromCenter >= 0;

		if (windowData.xPositiveBefore != windowData.xPositiveAfter)
			windowData.xShift = true;
		if (windowData.yPositiveBefore != windowData.yPositiveAfter)
			windowData.yShift = true;

		if (windowData.xShift || windowData.yShift){
			fixZ(windowData);
		}

		drawBlochs(windowData);

	})

}

function manageScroll(windowData){

	var windowCutoffTop = $(window).scrollTop() - $(window).height()/2;
	var windowCutoffBottom = $(window).scrollTop() * $(window).height()*1.5;

	$('section').each(function(){

		if ($(this).offset().top + $(this).height() < windowCutoffTop ||
			$(this).offset().top > windowCutoffBottom){
			$(this).addClass('off-screen');	
		} else {
			$(this).removeClass('off-screen');	
		}

	})

	drawBlochs(windowData);
	fixZ(windowData);
}

function drawBlochs(windowData){

	var ratio = windowData.xAmount / windowData.yAmount;

	var LRrotate = (1 - windowData.xAmount) * 180;
	var TBrotate = (1 - windowData.yAmount) * 180;

	if (!windowData.xPositiveAfter)
		LRrotate -= 180;
	if (!windowData.yPositiveAfter)
		TBrotate -= 180;

	var angle = Math.atan(-windowData.yFromCenter/windowData.xFromCenter);
	var degAngle = angle * 57.2958;
	var rad90 = 90/57.2958;
	var rad45 = 45/57.2958;

	var LRscale = 1 - ( Math.max( Math.abs(windowData.yFromCenter) - Math.abs(windowData.xFromCenter), 0) )*0.4;
	var TBscale = 1 - ( Math.max( Math.abs(windowData.xFromCenter) - Math.abs(windowData.yFromCenter), 0) )*0.4;

	var LRskew = -degAngle;
	var TBskew = degAngle - 90;


	$('section:not(.off-screen) .bloch:not(.shrink) .side.top-bottom').css('transform', 'skewX(' + TBskew + 'deg) rotateX(' + TBrotate + 'deg) scale(1,' + TBscale + ')') ;
	$('section:not(.off-screen) .bloch:not(.shrink) .side.left-right').css('transform', 'skewY(' + LRskew + 'deg) rotateY(' + LRrotate + 'deg) scale(' + LRscale + ',1)') ;

	xTranslate = $('section:not(.off-screen) .bloch .side.left-right')[0].getBoundingClientRect().width;
	xTranslate = windowData.xFromCenter > 0 ? xTranslate : -xTranslate;

	yTranslate = $('section:not(.off-screen) .bloch .side.top-bottom')[0].getBoundingClientRect().height;
	yTranslate = windowData.yFromCenter > 0 ? yTranslate : -yTranslate;

	$('section:not(.off-screen) .bloch:not(.shrink) .bloch:not(.shrink)').css('transform', 'translateX(' + xTranslate + 'px) translateY(' + yTranslate + 'px)');

	if (windowData.xShift){

		if (windowData.xPositiveAfter){
			$('.bloch:not(.shrink) .side.left-right').css('left', 'auto');
			$('.bloch:not(.shrink) .side.left-right').css('right', '100%');
			$('.bloch:not(.shrink) .side.left-right').css('transform-origin', '100% 50%');
		} else {
			$('.bloch:not(.shrink) .side.left-right').css('left', '100%');
			$('.bloch:not(.shrink) .side.left-right').css('right', 'auto');
			$('.bloch:not(.shrink) .side.left-right').css('transform-origin', '0% 50%');
		}

		windowData.xShift = false;
	}

	if (windowData.yShift){

		if (windowData.yPositiveAfter){
			$('.bloch:not(.shrink) .side.top-bottom').css('top', 'auto');
			$('.bloch:not(.shrink) .side.top-bottom').css('bottom', '100%');
			$('.bloch:not(.shrink) .side.top-bottom').css('transform-origin', '50% 100%');
			$('.bloch:not(.shrink) .side.top-bottom').removeClass('bottom-showing'); 
		} else {
			$('.bloch:not(.shrink) .side.top-bottom').css('top', '100%');
			$('.bloch:not(.shrink) .side.top-bottom').css('bottom', 'auto');
			$('.bloch:not(.shrink) .side.top-bottom').css('transform-origin', '50% 0%');
			$('.bloch:not(.shrink) .side.top-bottom').addClass('bottom-showing'); 
		}

		windowData.yShift = false;
	}
}

function fixZ(windowData){

	var blochs = [];

	$('section:not(.off-screen) .bloch:not(.shrink), section:not(.off-screen) .bloch-grid').each(function(){
		blochs.push({
			elem: $(this),
			top: $(this).offset().top,
			left: $(this).offset().left,
			depth: checkDepth($(this))
		})
	});

	if(windowData.xPositiveAfter){

		if(windowData.yPositiveAfter){		
			//left->right top->bottom
			blochs.sort(sortLeftTop);
		} else {
			//left->right bottom->top
			blochs.sort(sortLeftBottom);
		}
	} else {

		if(windowData.yPositiveAfter){
			//right->left top->bottom
			blochs.sort(sortRightTop);

		} else {
			//right->left bottom->top
			blochs.sort(sortRightBottom);
		}
	}

	var z = 1;

	blochs.forEach(function(bloch){

		bloch.elem.css('z-index', z);
		z++;

	})

}

function checkDepth(elem, selector){
	return $('section:not(.off-screen)').has(elem).length;
}

function sortLeftTop(a, b) {
	var aValue = a.depth*10000000000 + a.left*10000+ a.top;
	var bValue = b.depth*10000000000 + b.left*10000+ b.top;
	return bValue - aValue
}

function sortLeftBottom(a, b) {
	var aValue = a.depth*10000000000 + a.left*10000 - a.top;
	var bValue = b.depth*10000000000 + b.left*10000 - b.top;
	return bValue - aValue
}

function sortRightTop(a, b) {
	var aValue = a.depth*10000000000 - a.left*10000 + a.top;
	var bValue = b.depth*10000000000 - b.left*10000 + b.top;
	return bValue - aValue
}

function sortRightBottom(a, b) {
	var aValue = a.depth*10000000000 - a.left*10000 - a.top;
	var bValue = b.depth*10000000000 - b.left*10000 - b.top;
	return bValue - aValue
}

function manageBlochs(){

	$('.bloch-grid .bloch-grid-outline .bloch-outline').on('click', function(){
		var row = $(this).parent().data('grid-row');
		var col = $(this).data('grid-col');
		var grid = $(this).parentsUntil( ".bloch-grid" ).parent();

		$(grid).find('.bloch-grid-pieces tr:nth-child(' + (row) + ') td:nth-child(' + (col) + ')').toggleClass('shrink');	
	})
	$('.bloch-grid .grid-toggle').on('click', function(){

			$(this).parent().toggleClass('hide-grid');

	})

}

function generateGrids(){

	$('.bloch-grid:not(.created)').each(function(){

		var cols = $(this).data('grid-cols') || 10;
		var rows = $(this).data('grid-rows') || 10;
		var color = $(this).data('grid-color') || 'red';

		var markup = "<span class='grid-toggle  " + color + " toggle'>toggle<br>grid</span>";
		var outlineTable = "<table class='bloch-grid-outline'><tbody>";
		var piecesTable = "<table class='bloch-grid-pieces'><tbody>";

		for (var r = 1; r <= rows; r++){

			outlineTable += "<tr data-grid-row='" + r + "'>";
			piecesTable += "<tr data-grid-row='" + r + "'>";

				for (var c = 1; c <= cols; c++){

					outlineTable += "<td class='bloch-outline " + color + "' data-grid-col='" + c + "'></td>";
					piecesTable += "<td class='bloch " + color + " shrink' data-grid-col='" + c + "'></td>";

				}

			outlineTable += "</tr>";
			piecesTable += "</tr>";

		}

		outlineTable += "</tbody></table>";
		piecesTable += "</tbody></table>";

		markup += outlineTable + piecesTable;

		$(this).html(markup);
	})

}

