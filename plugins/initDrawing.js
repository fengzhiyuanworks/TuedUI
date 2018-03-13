// caveat: 
// MorphSVGPlugin.pathDataToBezier(path, { 
// offsetX: follower._gsTransform.xOrigin, offsetY: follower._gsTransform.yOrigin }) 
// offsetX and offsetY is based on follower's origin who use the besierPath as trail to follow, 
// so we must reset follower's origin



function initDrawing(obj) {
	var mainTl,
	tl,
	follower = obj.follower,
	followerOrigin = follower._gsTransform ? { x: follower._gsTransform.xOrigin, y: follower._gsTransform.yOrigin } : {x:0,y:0},
	target,
	targetBezier,
	drawDuration,
	showTrail = obj.showTrail ? obj.showTrail : true;
    timeScale = obj.timeScale ? obj.timeScale : 1;
	showTrail && TweenMax.set(obj.list, { drawSVG: "0"});

	var drawingOrigin = MorphSVGPlugin.pathDataToBezier(document.querySelector(obj.list[0]), {
		offsetX: -followerOrigin.x,
		offsetY: -followerOrigin.y,
	})

	var followerPosition = obj.followerPosition ? obj.followerPosition : drawingOrigin[0];

    MorphSVGPlugin.convertToPath("circle, polyline, rect, polygon, line, text");

	mainTl = new TimelineMax({
		onUpdate: obj.onUpdate ? obj.onUpdate : null,
		onComplete: obj.onComplete ? obj.onComplete : null,
		repeat: obj.repeat ? obj.repeat : 0,
		delay: obj.delay ? obj.delay : 0,
	});

	TweenMax.to(follower, 1.2, {x: followerPosition.x, y: followerPosition.y}).timeScale(timeScale);

	for (var i=0; i<obj.list.length; i++) {
		target = document.querySelector(obj.list[i]);
		targetBezier = MorphSVGPlugin.pathDataToBezier(target, {
			offsetX: -followerOrigin.x,
			offsetY: -followerOrigin.y
		});

		drawDuration = Math.round(target.getTotalLength()) / 150;

		tl = new TimelineMax();
		tl
		.to(follower, 0.5, {
			x: targetBezier[0].x,
			y: targetBezier[0].y,
			ease: Elastic.easeOut.config(0.61, 0.8)
		})
		.to(target, drawDuration, {
			drawSVG: "100%"
		})
		.to(follower, drawDuration, {
			bezier: {
				type: "cubic",
				values: targetBezier,
				autoRotate: false
			}
		}, "-=" + drawDuration);

		mainTl.add(tl);
	};
	mainTl.timeScale(timeScale);
	return mainTl;
};