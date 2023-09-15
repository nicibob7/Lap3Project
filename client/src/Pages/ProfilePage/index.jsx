import React, {useState, useEffect} from 'react';
import { useAuth } from '../../Contexts';
import './Profile.css'
import axios from 'axios'

const ProfilePage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState()
    const [tasksDisplayed, setTasksDisplayed] = useState(false)

    const handleRefresh = async () => {
        const response = await axios.get('https://debugthugsapi.onrender.com/timetable/')
        const data = response.data.entry
        setTasks(data)
    }

    const handleDisplay = async () => {
        setTasksDisplayed(!tasksDisplayed)
    }

    useEffect(() => {
        handleRefresh()
    }, [])

    console.log(tasks)
    console.log(user)

    try{
        tasks.filter((task) => task.name == user.name) 
    }catch(err){
        console.log(err.message)
    }


    let listItems

    if (tasks){
        listItems = tasks.map((task) => <li>{task.day}: {task.content}</li>)
    }

    return (
        <>
            <h1 style={{fontSize: 100}}>Account</h1>
            <div>
            <h2 style={{fontSize: 80, margin: 50}}>
                Name: {user.name}
            </h2>
            </div>
            <div>
            <h2 style={{fontSize: 80, margin: 50}}>
                Email: {user.email}
            </h2>
            </div>
            <div>
            <h2 style={{fontSize: 80, margin: 50, display: 'flex'}}>
                Picture: <img height={200} width={200} style={{borderRadius:'50%', marginLeft: '10%'}} src="https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/16:9/w_2560%2Cc_limit/1521-WIRED-Cat.jpeg" alt="Logo"/>
            </h2>
            </div>
            <div>
            <h2 style={{fontSize: 80, margin: 50}}>
                <button style={{backgroundColor: '#4CAF50', border: 'none', paddingTop: '1%', paddingBottom: '1%', paddingLeft: '2%', paddingRight: '2%', fontSize: 30, display:'block', margin:50, marginLeft: 0}} onClick = {handleDisplay}>Click to show tasks: </button>
                <ul>
                    {tasksDisplayed ? listItems : ""}
                </ul>
                
            </h2>
            </div>
        </>
    );
};

export default ProfilePage;
