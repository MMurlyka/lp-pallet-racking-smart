$(window).ready(function() {

	$('.slick').slick({
		variableWidth: true,
		slidesToShow: 3
	});

	$('.profit_in-area, .profit_s-location, .profit_s-type, .profit_in-height').change( calc);

	$(".header_btn, .b-order_btn, .storage_btn").click(function() {
		$(".fancy").trigger('click');
	});

	$(".in-phone").mask("+7 (999) 999-99-99");

	$(".fancy, .storage_pr a, .slick a").fancybox();

	$('form').ajaxForm({
		url: "mail.php",
		method: "post",
		beforeSubmit: function(data, $form) {
			var $name = $form.find(".in-name"),
				$phone = $form.find(".in-phone");
			
			printValid($name);
			printValid($phone);

			if( ! (valid($name) && valid($phone)) ) {
				return false;
			} else {
				$.fancybox.close();
				$form.trigger('reset');
				yaCounter36798385.reachGoal('form');
				
				return false
			}
		},

		success: function(responseText, statusText, xhr, $form) {
			$.fancybox.close();
			$form.trigger('reset');
		}

	});

	$(".nav a").click(function () {
		return anchor($(this).attr("href"));
	});
});

function calc() {
	var $loc_price = parseInt($(".s-location").val()),
		$type = parseInt($(".s-type").val()),
		$area = parseInt($(".i-area").val()),
		$h = parseInt($(".s-height").val()),
		$g_area = $(".graph_area"),
		$g_floor = $(".graph_floor"),
		$g_rack = $(".graph_rack"),
		$g_economy = $(".graph_economy"),
		$g_payback = $(".graph_payback");
	

	if(!$loc_price) {
		$loc_price = 1000;
	}

	if(!$type) {
		$type = 1;
	}
	console.log($h);
	if(!$h) {
		$h = 5;
	}

	if(!$area) {
		$area = 300;
	}
	console.log(
		$loc_price,
		$type,
		$area,
		$h);

	if($type == 1 || $type == 2) {
		
		var $k, $pm, $floor_rent, $rack_rent, $rack_price;

		if($type == 1) {
			$rack_price = 700;

			if($h == 5) {
				$k = 1.2;
			} else if($h == 7) {
				$k = 1.6;
			} else {
				$k = 2.4;
			}
		} else {
			$rack_price = 1800;

			if($h == 5) {
				$k = 1.8;
			} else if($h == 7) {
				$k = 2.4;
			} else {
				$k = 3.6;
			}
		}

		$pm = Math.ceil($area * 0.66);
		$floor_rent = $area * $loc_price;
		$rack_rent = Math.ceil($pm / $k) * $loc_price;
		$payback = Math.ceil(($pm * $rack_price) / ($floor_rent - $rack_rent));

		if($payback == Infinity) {
			$payback = 'Нет';
		}


		$g_area.html(
			'<span class="graph_number">' + ('' + $pm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') +'</span><br>' +
			'Палломест'
		);

		$g_rack.html(
			'Хранение на стелажах <br>' +
			'<span class="fa fa-bars"></span> Склад:&nbsp;&nbsp;&nbsp;&nbsp; ' + ('' + Math.ceil($pm / $k)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' м² <br>' +
			'<span class="fa fa-usd"></span> Аренда:&nbsp;&nbsp;&nbsp; ' + ('' + $rack_rent).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' руб. ' 
		);

		$g_economy.html(
			'Экономия на аренде:&nbsp; ' + ('' + ($floor_rent - $rack_rent)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 'руб. <br>' +
			'Стоимость стелажей:&nbsp; ' + ('' + ($pm * $rack_price) ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' руб.'
		);

		$g_payback.html(
			'Окупаемость <br>' +
			'<span class="graph_number">' + $payback + '</span> <br>' +
			'месяцев'
		);
	} else if($type == 3) {

		$hm = Math.floor(2.2 * $h);
		$sklad = Math.ceil(($area / $hm) + 20);
		$rent_floor = $area * $loc_price;
		$rent_rack = $sklad * $loc_price;

		$eco_rent = $rent_floor - $rent_rack;

		$price_rack = (($sklad - 20) * ($hm - 1)) * 6000;

		$payback = Math.ceil($price_rack / $eco_rent);

		$g_area.html(
			'<span class="graph_number">' + $area +'</span><br>' +
			'Полезная площадь'
		);

		$g_rack.html(
			'Хранение на стелажах <br>' +
			'<span class="fa fa-bars"></span> Склад:&nbsp;&nbsp;&nbsp;&nbsp; ' + ('' + $sklad).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' м² <br>' +
			'<span class="fa fa-usd"></span> Аренда:&nbsp;&nbsp;&nbsp; ' + ('' + $rent_rack).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' руб. ' 
		);

		$g_economy.html(
			'Экономия на аренде:&nbsp; ' + ('' + $eco_rent).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 'руб. <br>' +
			'Стоимость стелажей:&nbsp; ' + ('' + $price_rack ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' руб.'
		);

		$g_payback.html(
			'Окупаемость <br>' +
			'<span class="graph_number">' + $payback + '</span> <br>' +
			'месяцев'
		);
	}

	$g_floor.html(
			'Хранение на полу <br>' +
			'<span class="fa fa-bars"></span> Склад:&nbsp;&nbsp;&nbsp;&nbsp; ' + ('' + $area).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 'м² <br>' +
			'<span class="fa fa-usd"></span> Аренда:&nbsp;&nbsp;&nbsp; '+ ('' + Math.floor(($area * $loc_price))).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') +'руб.' 
			);
}

function anchor(id) {
		var d = $(id).offset().top,
			duration = 1100;

		$('html, body');

		$('html, body').animate({ scrollTop: d }, duration, (function () {
			
			//location.hash = id.substr(1);
		}));
		
		return false;
		
}

function valid ($input) {
	if($input.val().length > 2) {
		return true;
	}

	return false;
}

function printValid($input) {

	if(valid($input)) {
		$input.removeClass("invalid");
	} else {
		$input.addClass("invalid");
	}
}

