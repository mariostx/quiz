import { Button, FormControl, Grid, Radio, TextField } from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import axios from "axios";
import React, { FC, useState, } from "react";
import './style.css';

interface Question {
        author: string;
        question: string;
        answers: string[];
        category: string;
        language: string;
        correct: number[];
        created: string;
}

const labels: { [index: string]: string } = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Medium',
    4: 'Difficult',
    5: 'Very Difficult',
  };

const initQuestion: Question = {
    author: 'admin',
    question: '',
    answers: ['', '', '', ''],
    correct: [],
    category: '',
    language: 'hr',
    created: '',
}

const QuestionEdit: FC = () => {
    const [value, setValue] = React.useState<number | null>(2);
    const [hover, setHover] = React.useState(-1);
    const [questionData, setQuestionData] = useState<Question>(initQuestion);

    // useEffect(() => {
    //     setQuestionData({
    //         question: 'test',
    //         answers: ['answer1', 'answer2', 'answer3', 'answer4'],
    //         category: "music, history",
    //         language: 'hr',
    //         correctAnswers: [],
    //     });
    // }, []);

    const handleQuestionChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setQuestionData((questionData) => {
            return {...questionData, question: event?.currentTarget?.value};
        });
    }

    const handleRootAttribChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const name = event?.currentTarget?.name;
        const value = event?.currentTarget?.value;
        console.log(name, value);
        if (name) {
            setQuestionData((questionData) => {
                return {...questionData, [name]: value};
            });
        }
    }


    const handleAnswerChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const answers: string[] = questionData?.answers.slice() ?? [];
        answers[index] = event.currentTarget.value;
        setQuestionData((question) => {
            return {...question, answers: answers};
        });
    }

    const handleCorrectAnswerChange = (index: number) => {
        setQuestionData((question) => {
            return {...question, correct: [index]};
        });
    }

    const createAnswerElements = () => {
        return questionData?.answers?.map((answer: string, index: number) => {
            return (
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <div key={index} className={"answers" + (questionData.correct[0] === index ? " correct-answer" : "")}
                        style={{color: '#FFF'}}
                    >
                        <TextField
                            label={'Answer' + (index + 1)} 
                            type="text"
                            onChange={(event) => handleAnswerChange(event, index)}
                            value={answer}
                            required={true}
                            />
                        
                    </div>
                    <div style={{ marginLeft: '30px', maxWidth: '100px', width: '100px'}}>
                        <Radio
                                checked={questionData.correct[0] === index}
                                onChange={() => handleCorrectAnswerChange(index)}
                                value={index}
                                name="radio-button-answer"
                                required={true}
                            />
                    </div>
                </Grid>
            );
        });
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        questionData.created = new Date().toISOString();
        console.log('question', questionData);
        axios.post('http://localhost:3100/questions', questionData)
        .then(response => setQuestionData(initQuestion));
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="container-flex">
                <FormControl>
                    <div className="margin-bottom-10">
                        <TextField
                            label="Question"
                            name="question"
                            value={questionData?.question}
                            onChange={event => handleRootAttribChange(event)}
                            multiline={true}
                            required={true}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    {createAnswerElements()}
                    <div className="margin-top-10 margin-bottom-10">
                        <TextField  
                            label="Category"
                            name="category"
                            value={questionData?.category}
                            onChange={event => handleRootAttribChange(event)}
                            multiline={true}
                            required={true}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div>
                        <TextField  
                            label="Language"
                            name="language"
                            value={questionData?.language}
                            onChange={event => handleRootAttribChange(event)}
                            required={true}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div className="margin-top-10">
                        <Rating
                            name="customized-10"
                            value={value}
                            defaultValue={0}
                            max={5}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                        />
                    </div>
                    {value !== null && <label>{labels[hover !== -1 ? hover : value]}</label>}
                    
                </FormControl>
            </div>
            <div className="container-flex">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >Submit</Button>
            </div>
        </form>
    </div>)
}

export default QuestionEdit;
