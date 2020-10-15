/*-------------------------------發文切換----------------------------*/
$(document).ready(function()
{
	$(".post").click(function()
	{
		$("#postArticle").fadeToggle(500); 
	});
	$("#cancel").click(function()
	{
		$("#postArticle").hide(500); 
	});
}); 
/*----------------留言展開收合(之後會根據article_id來分別做收合)------------*/
$(document).ready(function()
{
	$(".open").click(function()
	{
		$(".command_box").slideToggle(500);
	});
}); 
/*-----------------------------modal對話框切換---------------------------*/
$(document).ready(function()
{
	$('#myModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); // 按下訊息按鈕觸發以下事件
	var name = button.data('whatever'); // data-whatever的內容
	var modal = $(this);  //指向事件物件本身
	modal.find('.modal-title').text(name);  //更改modal-title
	});
});
/*---------------------------like功能---------------------------------*/
/*var likes = 'trigger';
var counter = $(".like_counter").html().trim();	

$(document).ready(function(){   
	$(".like").click(function(){
		if(likes == 'trigger'){
			$(".like").addClass("red");
			counter++;
			$(".like_counter").html(counter);
			likes = 'unTrigger';
		}else if(likes == 'unTrigger'){
			$(".like").removeClass("red");
			counter--;
			$(".like_counter").html(counter);
			likes = 'trigger';
		}	 
	});
});*/
/*---------------------------------留言顯示------------------------------*/
$(document).ready(function(){  //之後要跟著文章id和留言id去做控制(不同文章的留言互不影響)，並且要把留言存入資料庫(打撈、刪除)
	document.addEventListener('keypress', function(event){
		if(event.keyCode === 13 || event.which === 13){ //which能兼容舊版瀏覽器
			var inputText = $(".cmd").val();
			var inputName = $(".command_id").html();
			if(inputText !== ""){
				var html = '<p class="command_user">%user%<span class="command_line">%command%</span><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></p><hr/>';
				var newHtml = html.replace('%command%', inputText);
				newHtml = newHtml.replace('%user%', inputName);
				$(".command_box").append(newHtml);

				var all_Inputs = $("input[type=text]");
				all_Inputs.val("");	
			}
		}
	});
});
/*---------------------------------貼文顯示 & like功能------------------------------*/
var artid = 0;
$(document).ready(function(){  
	$("#user_Post").click(function(){
		//var articleUser = $(".user_id").val();
		var articletext = $("#Article").val();
		if(articletext !== ""){
			var texthtml = '<div class="textshow_%pID%"><h3 class="user_id">%textUser%</h3><p class="article_test">%textCommand%</p></div><div class="command"><!--文章底下--><img class="like" src="img/heart2.svg" alt="" width="30px" height="30px"><label class="like_counter">0</label><hr/><div class="form-group row col-12 col-md-12"><label for="" class="col-3 col-md-2 col-form-label  command_id">%cmdUser%</label><input type="text" class="col-5 col-md-6 form-control cmd" name="user_text" placeholder="留言..."><!--upload pic、video--><input id="picInput" type="file" class="form-control upload" accept="image/*"><label for="picInput" class="col-2 col-md-1 "><img src="img/pic.svg" alt="" width="35px" height="35px"></label><input id="videoInput" type="file" class="form-control upload" accept="audio/*,video/*"><label for="videoInput" class="col-2 col-md-1"><img src="img/video.svg" alt="" width="35px" height="35px"></label></div><div class="container"><button type="button" class="btn btn-secondary  open">展開/收合</button><div class="row col-12"><div class="col-12 command_box"><!--這邊放留言--></div>	</div></div><hr/></div>';
			var newTexthtml = texthtml.replace('%textUser%', '我'); //直接去資料庫抓使用者名稱，不然會出現undefined(發文者)
			newTexthtml = newTexthtml.replace('%cmdUser%', '我'); //直接去資料庫抓使用者名稱，不然會出現undefined(留言者)
			newTexthtml = newTexthtml.replace('%textCommand%', articletext); //貼文內容
			newTexthtml = newTexthtml.replace('%pID%', artid); //貼文計數
			$(".article_id").prepend(newTexthtml);
			var all_Inputs = $("#Article");
			all_Inputs.val("");		
			$("#postArticle").hide(500); 
			artid++;

			var likes = 'trigger';
			var counter = $(".like_counter").html().trim();	
   
			$(".like").click(function(){
				if(likes == 'trigger'){
					$(".like").addClass("red");
					counter++;
					$(".like_counter").html(counter);
					likes = 'unTrigger';
				}else if(likes == 'unTrigger'){
					$(".like").removeClass("red");
					counter--;
					$(".like_counter").html(counter);
					likes = 'trigger';
				}	 
			});
		}
	});


});
/*-------------------------------貼文打包傳送----------------------------*/
var cnt = 0;
function article(){
	console.log($('#Article').val());
	if($('#Article').val() == '' && $('#picInput').val() == '' && $('#videoInput').val() == ''){
		alertMsg(NullPost);
	}
	else{
		var post_data = {
			user_id : '1gSui2YWgucqomwW7XEDwMLWoJg2',
			post_level : '1',
			article_text : $('#Article').val()
		};
		$.ajax({
			url: "http://"+ host + port +"/api/index",
			type: 'POST',
			data: JSON.stringify(post_data),
			contentType: "application/json;charset=utf-8",
			success: function(){
				console.log(returndata);
				alerMsgThenGoToSomewhere(SuccessPost,"./index.html");
			},
			error: function(xhr, ajaxOptions, thrownError){
				console.log(xhr.status);
				console.log(thrownError);
			}
		});

		/*const file = document.querySelector('input[type = "file"]');

		function uploadImg(e){
			console.log(e.target.files[0]);

			const formData = new FormData();
			formData.append('image',e.target.files[0]);
			//傳資料到後端
			axios.post(apiUrl, formData, {
				headers: {
				'Content-Type': 'multipart/form-data',
				},
			}).then((response) => {
				console.log(response.data)
			});
		}
		file.addEventListener('postImage',uploadImg);*/
	}
}



//'<div class="command"><!--文章底下--><img class="like" src="img/heart2.svg" alt="" width="30px" height="30px"><label class="like_counter">0</label><hr/><div class="form-group row col-12 col-md-12"><label for="" class="col-3 col-md-2 col-form-label  command_id">王小美</label><input type="text" class="col-5 col-md-6 form-control cmd" name="user_text" placeholder="留言..."><!--upload pic、video--><input id="picInput" type="file" class="form-control upload" accept="image/*"><label for="picInput" class="col-2 col-md-1 "><img src="img/pic.svg" alt="" width="35px" height="35px"></label><input id="videoInput" type="file" class="form-control upload" accept="audio/*,video/*"><label for="videoInput" class="col-2 col-md-1">zzzzzzzzz<img src="img/video.svg" alt="" width="35px" height="35px"></label></div><div class="container"><button type="button" class="btn btn-secondary  open">展開/收合</button><div class="row col-12"><div class="col-12 command_box"><!--這邊放留言--></div>	</div></div><hr/></div>'