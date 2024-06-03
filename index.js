import { tweetsData as initialTweetsData} from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
console.log(uuidv4());
const tweetInput = document.getElementById('tweet-input');

if (!localStorage.getItem('tweetsData')) {

    localStorage.setItem('tweetsData', JSON.stringify(initialTweetsData));

}

let tweetsData = JSON.parse(localStorage.getItem('tweetsData'));

document.addEventListener('click', function (e) { 

    if (e.target.dataset.like) {
        
        handleLikeClick(e.target.dataset.like);

    } else if (e.target.dataset.retweet) {
        
        handleRetweetClick(e.target.dataset.retweet);

    } else if (e.target.dataset.reply) {
      
        showReplyModal(e.target.dataset.reply);
        handleReplyClick(e.target.dataset.reply);

    } else if (e.target.id === 'tweet-btn') {

        handleTweetBtnClick();
        
    } else if ((e.target.classList.contains('reply-overlay')) || (e.target.classList.contains('close-reply-btn'))) {
        
        closeReplyModal();
        
    } else if (e.target.dataset.delete) {
        
        handleDeleteClick(e.target.dataset.delete);

    } else if (e.target.classList.contains('reply-btn')) {

        handleTweetReplyBtnClick(e.target.dataset.replyId);

    } else if (e.target.classList.contains('delete-reply-text')) {
        
        document.querySelector('.reply-input').value = '';
        document.querySelector('.reply-btn').disabled = true;
        document.querySelector('.reply-btn').style.opacity = 0.5;
        document.querySelector('.char-counter-circle').style.display = 'none';

    } else if (e.target.dataset.deleteReplyTweet) {

        handleDeleteTweetReplyClick(e.target.dataset.deleteReplyTweet);

    }
      
});

tweetInput.addEventListener('input', function () { 

    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';

});

function handleLikeClick(tweetId) {
    
    const targetTweetObject = tweetsData.filter(function (tweet) { 

        return tweet.uuid === tweetId; 
   
    })[0]; 
       
    if (targetTweetObject.isLiked) { 
       
        targetTweetObject.likes--; 

    } else {
        
        targetTweetObject.likes++;
    }

    targetTweetObject.isLiked = !targetTweetObject.isLiked; 
    saveTweetsDataToLocalStorage();
    render(); 
 
}


function handleRetweetClick(tweetId) {
    
    const targetTweetObject = tweetsData.filter(function (tweet) { 

        return tweet.uuid === tweetId;

    })[0];

    if (targetTweetObject.isRetweeted) {
        
        targetTweetObject.retweets--;

    } else {

        targetTweetObject.retweets++;

    }

    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted;
    saveTweetsDataToLocalStorage();
    render();

}

function handleReplyClick(replyId) {
    
    document.getElementById(`replies-${replyId}`).style.display = 'block';

}

function handleTweetBtnClick() {
   
    if (tweetInput.value) { 
    
        tweetsData.unshift({

            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()

        });
        
        saveTweetsDataToLocalStorage();
        render();
        tweetInput.value = '';
        tweetInput.height = 'auto';
        
    }
    
}

function handleTweetReplyBtnClick(replyId) {
    
    const tweetReplyInput = document.querySelector('.reply-input');
    
    if (tweetReplyInput.value) {
        
        const targetTweetObject = tweetsData.filter(function (tweet) { 

            return tweet.uuid === replyId;

        })[0];


        targetTweetObject.replies.unshift({
          
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: tweetReplyInput.value,
            uuid: uuidv4() 
            
        });

        saveTweetsDataToLocalStorage();
        render();     
        closeReplyModal();

    }
  
}

function handleDeleteClick(tweetId) {
    
    tweetsData = tweetsData.filter(function (tweet) { 

        return tweet.uuid != tweetId;

    });

    saveTweetsDataToLocalStorage();
    render();
        
}

function handleDeleteTweetReplyClick(tweetReplyId) {
    
    tweetsData = tweetsData.map(function(tweet) {
        
        tweet.replies = tweet.replies.filter(function (reply) {
            
            return reply.uuid !== tweetReplyId;

        });

        return tweet;

    });

    saveTweetsDataToLocalStorage();
    render();

}


function saveTweetsDataToLocalStorage() {
    
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));

}

function getFeedHtml() {
    
    let feedHtml = ``; 

    tweetsData.forEach(function (tweet) {   

        let likeIconClass = tweet.isLiked ? 'liked' : ``; 
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : ``;
       
        let repliesHtml = ``;
        
        if (tweet.replies.length > 0) {

            tweet.replies.forEach(function (reply) { 

                repliesHtml += `<div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                            <div>
                                                <p class="handle">${reply.handle}</p>
                                                <p class="tweet-text">${reply.tweetText}</p>
                                                <i class="fa-solid fa-trash" data-delete-reply-tweet="${reply.uuid}"></i>
                                            </div>                     
                                        </div>
                                </div>`;                  

                });
                  
        }
      
        feedHtml += `<div class="tweet">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                        ${tweet.retweets}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                                    </span>
                                </div>   
                            </div>            
                        </div>
                        <div id="replies-${tweet.uuid}" class="hidden">
                            ${repliesHtml}
                        </div>
                    </div>`;

                });
   
    return feedHtml;

}

getFeedHtml();


function render() {
    
    console.log('Rendering tweets...');

    console.log('Current tweetsData:', tweetsData);

    const feedElement = document.getElementById('feed');

    if (feedElement) {

        feedElement.innerHTML = getFeedHtml();

    } else {

        console.error('No element with ID "feed" exists.');

    }

}

render();


function showReplyModal(replyId) {

    let modalHeader = ``;
    
    tweetsData.forEach(tweet => {
    
        if (tweet.uuid === replyId) {
    
            modalHeader = `<div class="modal-header">
                                <img src="${tweet.profilePic}" class="profile-pic">
                                <span class="tweet-handle">Replying to ${tweet.handle}</span>
                           </div>
                           <div class="modal-text">
                                <textarea 
			                    class="reply-input"
                                rows="2"
			                    placeholder="Post your reply"
                                maxlength="280"></textarea>
                                <div class="tweet-reply-icon-btn-container">
                                    <div class="fa-icon-container">  
                                        <span>
                                            <i class="fa-light fa-image icon"></i>
                                        </span>
                                        <span>
                                            <i class="fa-regular fa-gif icon"></i>
                                        </span>
                                        <span>
                                            <i class="fa-regular fa-face-smile icon"></i>
                                        </span>
                                        <span>
                                            <i class="fa-regular fa-location-dot icon"></i>
                                        </span>
                                        <span class="tweet-detail">
                                            <i class="fa-solid fa-trash delete-reply-text"></i>
                                        </span>
                                    </div>
                                    <div class="counter-reply-btn-container"> 
                                        <div class="char-counter-container">
                                            <div class="char-counter-circle"></div>                               
                                        </div>
                                        <div class="reply-btn-container">
                                            <button class="reply-btn" data-reply-id="${replyId}" disabled>Reply</button>
                                        </div>
                                    </div>
                                </div>
                           </div>`;  						
			                                             
            }
        
    });
    
    document.querySelector('.reply-modal-inner').innerHTML = modalHeader;     
    document.querySelector('.reply-overlay').style.display = 'block';
    document.querySelector('.reply-modal').style.display = 'block';

    const tweetReplyTextArea = document.querySelector('.reply-input');
    const charCounterCircle = document.querySelector('.char-counter-circle');
    const replyButton = document.querySelector('.reply-btn');
    
    if (tweetReplyTextArea) {
        
        tweetReplyTextArea.addEventListener('input', function () {
              
            charCounterCircle.style.display = 'block';
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
            const percentage = (this.value.length / 280) * 100;
            charCounterCircle.style.background = `conic-gradient(#1DA1F2 ${percentage}%, transparent ${percentage}%)`;
            replyButton.disabled = !this.value.trim();
            replyButton.style.opacity = replyButton.disabled ? 0.5 : 1;
                
        });

            tweetReplyTextArea.style.height = 'auto';
            tweetReplyTextArea.style.height = tweetReplyTextArea.scrollHeight + 'px';      
    }
           
}

function closeReplyModal() {
    
    document.querySelector('.reply-overlay').style.display = 'none';
    document.querySelector('.reply-modal').style.display = 'none';

}







