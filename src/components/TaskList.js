import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../App";
import loadingImg from "../assets/loader.gif";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const completedTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(completedTask);
  }, [tasks]);

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty.");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: !task.completed,
    };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Task:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Task: {completedTasks.length}</b>
          </p>
        </div>
      )}

      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added. please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
      {/* <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error dolore saepe modi natus sequi animi doloremque ducimus quasi. Mollitia cupiditate eveniet, odio soluta eligendi illum at reprehenderit nihil aspernatur, iusto veniam nulla assumenda consequuntur dolor, harum magnam iure nesciunt repellat dignissimos veritatis commodi esse quo qui. Nostrum nisi provident voluptate corporis esse minus voluptatem inventore repellat consequuntur asperiores accusantium sapiente eum repudiandae cupiditate amet quam officiis natus facilis, ipsa atque quidem ad beatae delectus! Cum itaque, odio adipisci repudiandae corporis assumenda maiores facere aut dolore quos, nam voluptates a eaque sed cumque placeat velit numquam rerum? Explicabo magni amet mollitia!</div> */}
    </div>
  );
}

export default TaskList;
