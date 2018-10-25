import axios from 'axios';


export function getTasks() {
  return axios.get('http://18.218.74.222/tasks').then(r => r.data.tasks || []);
}

export function createTask(name) {
  return axios.post(`http://18.218.74.222/task?name=${name}`).then(r => r.data.task);
}

export function deleteTask(id) {
  return axios.post(`http://18.218.74.222/task/${id}/delete`).then(r => r.data);
}
