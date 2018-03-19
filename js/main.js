;(function () {
	
	'use strict';

	$(document).ready(function() {
		$("#lightSlider").lightSlider({ gallery: true,
			item: 1,
			loop: true,
			slideMargin: 0,
			thumbItem: 9,
			auto: true,
			speed: 1000,
			pause: 3000
		});

	});
	/*----------------------------------------
		Slider
	----------------------------------------*/

		var $slider = $(".slider"),
			$slideBGs = $(".slide__bg"),
			diff = 0,
			curSlide = 0,
			numOfSlides = $(".slide").length-1,
			animating = false,
			animTime = 500,
			autoSlideTimeout,
			autoSlideDelay = 6000,
			$pagination = $(".slider-pagi");

		function createBullets() {
			for (var i = 0; i < numOfSlides+1; i++) {
				var $li = $("<li class='slider-pagi__elem'></li>");
				$li.addClass("slider-pagi__elem-"+i).data("page", i);
				if (!i) $li.addClass("active");
				$pagination.append($li);
			}
		};

		createBullets();

		function manageControls() {
			$(".slider-control").removeClass("inactive");
			if (!curSlide) $(".slider-control.left").addClass("inactive");
			if (curSlide === numOfSlides) $(".slider-control.right").addClass("inactive");
		};

		function autoSlide() {
			autoSlideTimeout = setTimeout(function() {
				curSlide++;
				if (curSlide > numOfSlides) curSlide = 0;
				changeSlides();
			}, autoSlideDelay);
		};

		autoSlide();

		function changeSlides(instant) {
			if (!instant) {
				animating = true;
				manageControls();
				$slider.addClass("animating");
				$slider.css("top");
				$(".slide").removeClass("active");
				$(".slide-"+curSlide).addClass("active");
				setTimeout(function() {
					$slider.removeClass("animating");
					animating = false;
				}, animTime);
			}
			window.clearTimeout(autoSlideTimeout);
			$(".slider-pagi__elem").removeClass("active");
			$(".slider-pagi__elem-"+curSlide).addClass("active");
			$slider.css("transform", "translate3d("+ -curSlide*100 +"%,0,0)");
			$slideBGs.css("transform", "translate3d("+ curSlide*50 +"%,0,0)");
			diff = 0;
			autoSlide();
		}

		function navigateLeft() {
			if (animating) return;
			if (curSlide > 0) curSlide--;
			changeSlides();
		}

		function navigateRight() {
			if (animating) return;
			if (curSlide < numOfSlides) curSlide++;
			changeSlides();
		}

		$(document).on("mousedown touchstart", ".slider", function(e) {
			if (animating) return;
			window.clearTimeout(autoSlideTimeout);
			var startX = e.pageX || e.originalEvent.touches[0].pageX,
				winW = $(window).width();
			diff = 0;

			$(document).on("mousemove touchmove", function(e) {
				var x = e.pageX || e.originalEvent.touches[0].pageX;
				diff = (startX - x) / winW * 70;
				if ((!curSlide && diff < 0) || (curSlide === numOfSlides && diff > 0)) diff /= 2;
				$slider.css("transform", "translate3d("+ (-curSlide*100 - diff) +"%,0,0)");
				$slideBGs.css("transform", "translate3d("+ (curSlide*50 + diff/2) +"%,0,0)");
			});
		});

		$(document).on("mouseup touchend", function(e) {
			$(document).off("mousemove touchmove");
			if (animating) return;
			if (!diff) {
				changeSlides(true);
				return;
			}
			if (diff > -8 && diff < 8) {
				changeSlides();
				return;
			}
			if (diff <= -8) {
				navigateLeft();
			}
			if (diff >= 8) {
				navigateRight();
			}
		});

		$(document).on("click", ".slider-control", function() {
			if ($(this).hasClass("left")) {
				navigateLeft();
			} else {
				navigateRight();
			}
		});

		$(document).on("click", ".slider-pagi__elem", function() {
			curSlide = $(this).data("page");
			changeSlides();
		});

	/*----------------------------------------
		Detectar Dispositivo
	----------------------------------------*/

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};



	var parallax = function() {
		if ( !isMobile.any()) {
			$(window).stellar();
		}
	};

	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#gtco-offcanvas, .js-gtco-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	    	if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-gtco-nav-toggle').removeClass('active');
	    	}
	    }
		});

	};

	

	var header = function() {
		$(window).scroll(function(){
			var st = $(window).scrollTop();
			if (st > 50) {
				$('.gtco-nav').addClass('scrolled');
			} else {
				$('.gtco-nav').removeClass('scrolled');
			}
		});
   
	};

	var navigation = function() {

		$('body').on('click', '#gtco-offcanvas ul a:not([class="external"]), .main-nav a:not([class="external"])', function(event){
			var section = $(this).data('nav-section');
				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500, 'easeInOutExpo');
			   }

			   if ($('body').hasClass('offcanvas')) {
			   	$('body').removeClass('offcanvas');
			   	$('.js-gtco-nav-toggle').removeClass('active');
			   }
		   event.preventDefault();
		   return false;
		});

	};


	var offcanvasMenu = function() {

		$('body').prepend('<div id="gtco-offcanvas" />');
		$('body').prepend('<a href="#" class="js-gtco-nav-toggle gtco-nav-toggle"><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#gtco-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#gtco-offcanvas').append(clone2);

		$('#gtco-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#gtco-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function(){
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');				
		}).mouseleave(function(){

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');				
		});


		$(window).resize(function(){

			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-gtco-nav-toggle').removeClass('active');
				
	    	}
		});
	};


	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('.main-nav > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};

	var burgerMenu = function() {

		$('body').on('click', '.js-gtco-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('offcanvas') ) {
				$('body').removeClass('offcanvas');
			} else {
				$('body').addClass('offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".gtco-loader").fadeOut("slow");
	};

	


	
	$(function(){
		parallax();
		mobileMenuOutsideClick();
		header();
		navigation();
		offcanvasMenu();
		burgerMenu();
		navigationSection();
		contentWayPoint();
		dropdown();
		goToTop();
		loaderPage();
	});




}());