import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as yup from "yup";

// schema do login
const schema = yup.object().shape({
  login: yup.string().required("Usuário ou Email é obrigatório"),
});

export default function ForumPost({ show, onClose }) {
  //validação form
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  });

  const { login } = useAuth();

  //controle de mudança dos inputs
  const handleChange = (e) => {
  };

  // controle do console sobre o estado do modal
  useEffect(() => {
    console.log("Modal show prop mudou para:", show);
  }, [show]);

  return (
    <>
    </>

  )
}

ForumPost.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
