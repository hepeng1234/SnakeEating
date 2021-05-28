var sw = 20, //一个方块的宽
	sh = 20, //一个方块的高
	tr = 30, //行数
	td = 30; //列数

var snake = null

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
Square.prototype.remove = function() {
	this.parent.remove(this.viewContent)
}

//蛇
function Snake() {
	this.head = null //蛇头
	this.tail = null //蛇尾
	this.pos = [] //存蛇身体每一个圆的位置

	this.directionNum = { //存蛇走的方向
		left: {
			x: -1,
			y: 0
		},
		right: {
			x: 1,
			y: 0
		},
		up: {
			x: 0,
			y: -1
		},
		down: {
			x: 0,
			y: 1
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

	//给蛇添加一个熟悉，用来表示蛇走的方向
	// $(document).keyup((event) => {
	// 	switch (event.keyCode) {
	// 		case 38:
	// 			this.directionNum = this.directionNum.up;
	// 			break;
	// 		case 40:
	// 			this.directionNum = this.directionNum.down;
	// 			break;
	// 		case 37:
	// 			this.directionNum = this.directionNum.left;
	// 			break;
	// 		case 39:
	// 			this.directionNum = this.directionNum.right;
	// 			break;
	// 		default:
	// 			console.log('无效')
	// 	}
	// })
	this.directionNum = this.directionNum.up
}
//用来获取蛇头下一个位置对应的元素，以及要做的事件
Snake.prototype.getNextPos = function() {
	var nextPos = [this.head.x / sw + this.directionNum.x, this.head.y / sh + this.directionNum.y]
	
	//下个点是自己，游戏结束
	
	//下个点是围墙，游戏结束
	
	//下个点是苹果，吃，身体增加一个，走下一步
	
	//下个点为空，走下一步
}


snake = new Snake()
snake.init()
snake.getNextPos()
