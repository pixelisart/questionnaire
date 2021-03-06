

var MAINAPP = (function(nsp, $, domU, strU) {

    /*
    Quiz Functionality
    */
    var contentObj = {},
        questionsArray = [],
        navigationProto = {}, //Setup in setUpNavigation()
        prevBtn, 
        nextBtn;

    var loadJSON = function(path) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType('application/json');
        xobj.open('GET', path);
        xobj.onreadystatechange = function() {
            if (xobj.readyState === 4) {
                contentObj = JSON.parse(xobj.responseText);
                //console.log(contentObj);
                parseData(contentObj);
            }
        };
        xobj.send(null);
    },
    parseData = function(cObj) {
        questionsArray = cObj.questions;
        //set button text
        domU.setHTML($('.fill-in-submit'), cObj.buttonText);
        
        for (let i = 0; i < questionsArray.length; i++) {
            // Simply replacing the first question object with a new question object by calling the Question constructor.
            questionsArray[i] = new Question(questionsArray[i]);
        }
        //console.log(questionArray);

        // Populate the first question.
        // 1.) First call the populate method which reside in the prototype
        questionsArray[1].populateTheQuestion();
        questionsArray[1].displayQuestion();
    },

    initQuiz = function() {
        loadJSON("../JSON/content.json");
    };

    // Create a constructor
    var Question = function(obj) {
        console.log(obj); // Displays the 4 questions from the json data.
        var htmlDiv;
        
        // obj.type from the json file contains 
        // multi-choice
        // fill-in
        // true-false
        // This checks if the obj.type is "true-false" set it to multi-choice, otherwise, set it to obj.type (which is other types)
        this.questionDiv = (obj.type === "true-false") ? "multi-choice" : obj.type;

        this.type = obj.type || "No object type used";
        this.id = obj.id || "0";
        this.questionText = obj.questionText || "No question made";
        this.distractorText = obj.distractors || "No distractors made";
        this.correctResp = obj.correctResp || "No response";
        this.feedback = obj.feedback || "No feedback";
        this.weight = obj.weight || 0;
        this.result = "no-answer";
        this.studentResp = "";
        this.correct = false;

        //Assign DOM elements
        htmlDiv = $('#'+this.questionDiv)[0]; // Data from this.questionDiv is passed in as an id of the element.  It is assigned to htmlDiv.
        //console.log(htmlDiv); 

        // At this point, i get the initial div, at this point i can identify the questionField, noAnswerFeed, correctFeed and incorrectFeed
        this.questionField = htmlDiv.querySelector(".question-text");
        console.log(this.questionField);
        this.noAnswerFeed = htmlDiv.querySelector(".feedback.no-answer");
        console.log(this.noAnswerFeed);
        this.correctFeed = htmlDiv.querySelector(".feedback.correct");
        console.log(this.correctFeed);
        this.inccorrectFeed = htmlDiv.querySelector(".feedback.incorrect");
        console.log(this.inccorrectFeed);
        
        // Then i also assign the correct div to the object.  Which i always know the correct div
        this.htmlDiv = htmlDiv;
        console.log("this.htmlDiv: " + this.htmlDiv); 

        // When second question is populated, the distractors are not populated.
        // Below is the solution to populate the distractors.
        // The "this.questionDiv" contains either fill-in or multi-choice
        switch (this.questionDiv) {
            case "fill-in":
                this.populateTheQuestion = function() {
                    this.populateQuestion();
                    htmlDiv.querySelector('textarea').value = ""; // Removes the answer by the time the next question is shown.
                };
                console.log("this.populateTheQuestion: " + this.populateTheQuestion);
                this.checkTheAnswer = function() {
                    console.log("fill-in");
                    
                };
                break;
            case "multi-choice":
                // Grabs all of the <label> elements
                var distractors = htmlDiv.querySelectorAll('label'),
                    distractorsRadio = htmlDiv.querySelectorAll('input');
                this.populateTheQuestion = function() {
                    this.populateQuestion();

                    // Display none all of the distractors
                    domU.addClass(distractors, 'remove');

                    // Loops through all the distractors
                    for (let i = 0; i < distractors.length; i++) {
                        if (this.distractorText[i] !== undefined) {
                            // Adds the text that it needs to the distractors label element.
                            distractors[i].innerHTML = this.distractorText[i];

                            // Then remove the .remove class so that the distractors will show up
                            domU.removeClass([distractors[i]],'remove');
                        }
                    }

                    // Loops through all the input type="radio" fields
                    for (let i = 0; i < distractorsRadio.length; i++) {

                        // Simply set the checked to false.
                        // This makes sure that none of them are checked or selected.
                        distractorsRadio[i].checked = false;
                    }
                };
                this.checkTheAnswer = function() {
                    
                };
                break;
            default:
                this.populateTheQuestion = function() {
                    this.populateQuestion();
                };
                break;
        }
    };

    // var q1 = new Question("multi-choice", 1, "What is a constructor", "It's a person", "It is a special method for creating and initializing an object created within a class.", "", 1, "", "", false);
    // console.log(q1);

    // Simply remove the hidden-question class
    Question.prototype.displayQuestion = function() {
        domU.removeClass([this.htmlDiv],'hidden-question');
    };

    // Simply add the hidden-question class
    Question.prototype.hideQuestion = function() {
        domU.addClass([this.htmlDiv], 'hidden-question');
    };

    // Populates the question when populateQuestion() is executed.
    Question.prototype.populateQuestion = function() {
        //Set Question text
        this.questionField.innerHTML = this.questionText;
        console.log("this.questionField.innerHTML: " + this.questionField.innerHTML);

        this.noAnswerFeed.innerHTML = '<p><span>X </span>' + this.feedback.noAnswer + '</p>';
        console.log("this.noAnswerFeed.innerHTML: " + this.noAnswerFeed.innerHTML);

        this.correctFeed.innerHTML = '<p><span>&#10003 </span>' + this.feedback.correctAnswer + '</p>';
        console.log("this.correctFeed.innerHTML: " + this.correctFeed.innerHTML);

        this.inccorrectFeed.innerHTML = '<p><span>X </span>' + this.feedback.wrongAnswer + '</p>';
        console.log("this.inccorrectFeed.innerHTML: " + this.inccorrectFeed.innerHTML);
    };
    Question.prototype.hideFeedback = function() {
        var feedback = this.htmlDiv.querySelectorAll('.feedback.visible');
        domU.removeClass(feedback, 'visible');
    };

    // By default, displayFeedback() is set to no-answer
    Question.prototype.displayFeedback = function() {
        var feedback = $('.feedback.' + this.result);
        domU.addClass(feedback, 'visible');
    };
    Question.prototype.checkAnswer = function() {

    };
    

    /*
    Setup
    */
    UTIL.domReady(function() {
        initQuiz();
    });

    //Public Methods and Properties
    nsp.initQuiz = initQuiz;
    nsp.Question = Question;

    return nsp;
    
})(MAINAPP || {}, UTIL.dom.$, UTIL.dom, UTIL.string);