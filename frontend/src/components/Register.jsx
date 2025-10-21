import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [rollNo, setRollNo] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/register', {
                rollNo,
                name,
                password
            });

            if (response.data && response.data.message === "Registration successful") {
                alert("Registered successfully! Please login.");
                navigate('/login');
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
        <div className="d-flex justify-content-center align-items-center text-center vh-100" 
             style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
            <div className="bg-white p-4 rounded" style={{ width: '40%' }}>
                <h2 className='mb-3 text-primary'>Register</h2>
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
                        <label className="form-label"><strong>Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>

                <p className='my-3'>Already have an account?</p>
                <Link to='/login' className="btn btn-secondary w-100">Login</Link>
            </div>
        </div>
    );
};

export default Register;
