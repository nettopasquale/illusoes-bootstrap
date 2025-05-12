import {Button, Form} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import LayoutGeral from '../../components/LayoutGeral/LayoutGeral';

function Login() {

//login nome ou email
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [validEmail, setValdEmail] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

  //login senha
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

  //validação senha
    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

  //mensagem de erro
    const [erroMsg, setErroMsg] = useState('');
    const [sucesso, setSucesso] = useState(false);
    
    const userRef = useRef();
    const errRef = useRef();

    return (
      <LayoutGeral>
            <Form>
            <Form.Group className="mb-3" controlId="formUserMail">
                <Form.Label>Usuário ou Email</Form.Label>
                <Form.Control type="text" placeholder="Digite o nome do usuário ou Email" />
                <Form.Text className="text-muted">
                
                </Form.Text>
                </Form.Group>
                
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
                
            <Button variant="dark" type="submit">
                Cadastrar
            </Button>
                <span>Ainda não é cadastrado?</span>
                <a href='/cadastro'>Faça seu cadastro</a>
            </Form> 
      </LayoutGeral>
  );
}

export default Login;