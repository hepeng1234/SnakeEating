var sw = 20, //一个方块的宽
	sh = 20, //一个方块的高
	tr = 30, //行数
	td = 30; //列数

var snake = null,
	food = null,
	game = null

function Square(x, y, classname) {
	this.x = x * sw
	this.y = y * sh
	this.classN = classname

	this.viewContent = $(`<div class="${this.classN}"></div>`)
	this.parent = $('#snakeWrap')
}
//创建方块
Square.prototype.create = function() {
	this.viewContent.css({
		'position': 'absolute',
		'width': sw + 'px',
		'height': sh + 'px',
		'left': this.x + 'px',
		'top': this.y + 'px'
	})
	this.parent.append(this.viewContent)
}
Square.prototype.removes = function() {
	this.viewContent.remove()
}

//蛇
function Snake() {
	this.head = null //蛇头
	this.tail = null //蛇尾
	this.pos = [] //存蛇身体每一个圆的位置

	this.direct = {}
	this.directionNum = { //存蛇走的方向
		left: {
			x: -1,
			y: 0,
			rotate: 90
		},
		right: {
			x: 1,
			y: 0,
			rotate: -90
		},
		up: {
			x: 0,
			y: -1,
			rotate: 180
		},
		down: {
			x: 0,
			y: 1,
			rotate: 0
		}
	}
}
Snake.prototype.init = function() {
	//创建蛇头
	var snakeHead = new Square(2, 0, 'snakeHead')
	snakeHead.create()
	this.head = snakeHead //存蛇头的信息
	this.pos.push([2, 0]) //蛇头位置保存起来

	//创建蛇身体
	var snakeBody1 = new Square(1, 0, 'snakeBody')
	snakeBody1.create()
	this.pos.push([1, 0])

	var snakeBody2 = new Square(0, 0, 'snakeBody')
	snakeBody2.create()
	this.tail = snakeBody2 //存蛇尾的信息
	this.pos.push([0, 0])

	//形成链式关系
	snakeHead.last = null
	snakeHead.next = snakeBody1

	snakeBody1.last = snakeHead
	snakeBody1.next = snakeBody2

	snakeBody2.last = snakeBody1
	snakeBody2.next = null
	//给蛇添加一个属性，用来表示蛇走的方向
	this.direction = this.directionNum.right
}
//用来获取蛇头下一个位置对应的元素，以及要做的事件
Snake.prototype.getNextPos = function() {
	var nextPos = [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]
	//下个点是自己，结束
	var selfCollied = false
	this.pos.forEach((value) => {
		if (nextPos[0] == value[0] && nextPos[1] == value[1]) {
			selfCollied = true
			this.strategise.die.call(this)
		}
	})
	if (selfCollied) {
		console.log("撞到自己了")
		this.strategise.die.call(this)
		return
	}
	//下个点是边界，结束
	if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td - 1 || nextPos[1] > tr - 1) {
		console.log("撞墙了")
		this.strategise.die.call(this)
		return
	}
	//下个点是苹果，吃，身体增加一个，走下一步
	if (nextPos[0] == food.pos[0] && nextPos[1] == food.pos[1]) {
		console.log('吃苹果')
		this.strategise.eat.call(this)
		return
	}
	//下个点为空，走下一步
	this.strategise.move.call(this)
}

//处理碰撞后的事件
Snake.prototype.strategise = {
	move(format = true) { //format判断是否删除蛇尾,不删则增加身体
		console.log('move')
		//创建新身体
		var newBody = new Square(this.head.x / sw, this.head.y / sh, 'snakeBody')
		newBody.next = this.head.next
		newBody.next.last = newBody
		newBody.last = null
		this.head.removes()
		newBody.create()

		//创建新蛇头
		var nextPos = [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]
		var newHead = new Square(nextPos[0], nextPos[1], 'snakeHead')
		newHead.create()
		newHead.next = newBody
		newBody.last = newHead
		newHead.last = null
		this.head = newHead
		newHead.viewContent.css({
			transform: `rotate(${this.direction.rotate}deg)`
		})

		//跟新坐标
		this.pos.splice(0, 0, [nextPos[0], nextPos[1]])

		//蛇尾
		if (format) {
			this.tail.removes()
			this.tail = this.tail.last
			this.tail.next = null
			this.pos.pop()
		}

	},
	eat() {
		console.log('eat')
		this.strategise.move.call(this, false)
		createFood()
		game.score++
	},
	die() {
		console.log('die')
		game.over()
	}
}



snake = new Snake()



//创建苹果
function createFood() {
	var x = null,
		y = null

	var include = true
	while (include) {
		x = Math.round(Math.random() * (td - 1))
		y = Math.round(Math.random() * (tr - 1))
		include = snake.pos.find(value => {
			return value[0] == x && value[1] == y
		})
	}
	food = new Square(x, y, 'food')
	food.pos = [x, y]
	if ($(".food").length) {
		$(".food").css({
			left: x * sw + 'px',
			top: y * sh + 'px'
		})
	} else {
		food.create()
	}
}


//设置游戏逻辑
function Game() {
	this.timer = null
	this.score = 0
}
Game.prototype.init = function() {
	snake.init()
	createFood()
	$(document).keyup((event) => {
		if (event.keyCode == 37 && snake.direction != snake.directionNum.right) {
			snake.direction = snake.directionNum.left
		} else if (event.keyCode == 38 && snake.direction != snake.directionNum.down) {
			snake.direction = snake.directionNum.up
		} else if (event.keyCode == 39 && snake.direction != snake.directionNum.left) {
			snake.direction = snake.directionNum.right
		} else if (event.keyCode == 40 && snake.direction != snake.directionNum.up) {
			snake.direction = snake.directionNum.down
		}
	})

	this.start()
}
//开始游戏
Game.prototype.start = function() {
	this.timer = setInterval(() => {
		snake.getNextPos()
	}, 200)
}
//结束游戏
Game.prototype.over = function() {
	clearInterval(this.timer)
	alert("游戏结束你的得分为" + this.score)
	$("#snakeWrap").children().remove()
	$(".startBtn").css('display', 'block')
	snake = new Snake()
	game = new Game()
}
//暂停游戏
Game.prototype.stop = function() {
	clearInterval(this.timer)
	console.log(this.timer)
}

game = new Game()

$(".startBtn>button").on('click', () => {
	game.init()
	$(".startBtn").css('display', 'none')
})
$("#snakeWrap").on('click', () => {
	console.log('暂停')
	game.stop()
	$(".pauseBtn").css('display', 'block')
})

$(".pauseBtn>button").on('click', () => {
	game.start()
	$(".pauseBtn").css('display', 'none')
})
