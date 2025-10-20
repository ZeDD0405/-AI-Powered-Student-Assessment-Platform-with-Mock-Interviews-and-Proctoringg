import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [rollNo, setRollNo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!rollNo || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/login', {
                rollNo,
                password
            });

            if (response.data && response.data.message === "Login successful") {
                alert("Login successful!");
                navigate('/home');
            } else {
                alert(response.data.error || response.data);
            }

        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data.error || err.response.data);
            } else {
                alert("Something went wrong. Try again.");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))"}}>
            <div className="bg-white p-4 rounded" style={{width: '40%'}}>
                <h2 className='mb-3 text-primary'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Roll No</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Roll No"
                            className="form-control"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                <p className='my-3'>Don't have an account?</p>
                <Link to='/register' className="btn btn-secondary w-100">Register</Link>
            </div>
        </div>
    );
};

export default Login;
