import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/layouts/Modal';
import axiosInstance from '../../utils/AxiosConfig';
import ReactFlagsSelect from "react-flags-select";
import CustomDatePicker from '../../components/ui/CustomDatePicker';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [birthday, setBirthday] = useState();

    const handleDateChange = (date) => {
        setBirthday(date);
    };

    const navigate = useNavigate();

    const onClose = () => {
        navigate("/")
    }

    // Método auxiliar para formatear la fecha
    const formatDate = (date) => {
        if (!date) return null; // Manejo de fecha nula

        const parsedDate = new Date(date);
        return {
            anio: parsedDate.getFullYear(),
            mes: parsedDate.getMonth() + 1,  // Los meses en JavaScript van de 0 a 11, por eso se suma 1
            dia: parsedDate.getDate()
        };
    };

    const register = async (event) => {
        event.preventDefault();

        // Formatear la fecha de cumpleaños usando el método auxiliar
        const formattedBirthday = formatDate(birthday);
        try {
            const response = await axiosInstance.post('/v1/register', {
                username,
                password,
                email,
                country,
                birthday: formattedBirthday // Enviar la fecha en el formato correcto
            });
            console.log('Registration successful!');

            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error.response?.data?.message || error.message);
        }
    };

    return (
        <Modal showModal={true} onConfirm={register} closeModal={onClose} title="Registrarse">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '325px', margin: '5px' }}>
                <ReactFlagsSelect
                    selected={country}
                    onSelect={(code) => setCountry(code)}
                    placeholder="País"
                    searchPlaceholder="Buscar"
                    searchable
                />
                <CustomDatePicker selectedDate={birthday} handleDateChange={handleDateChange} />
            </div>
            <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Modal>
    );
};