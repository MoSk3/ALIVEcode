import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import { Post } from "../../Models/Forum/post.entity";
import Form from "react-bootstrap/esm/Form";
import { Button } from "react-bootstrap";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { plainToClass } from "class-transformer";
import api from "../../Models/api";
import { CategorySubject } from "../../Models/Forum/categorySubject.entity";
import { Subject } from "../../Models/Forum/subjects.entity";
import { SubmitHandler, useForm } from "react-hook-form";
import { formQuestionProps } from "./forumFormQuestionTypes";
import { UserContext } from "../../state/contexts/UserContext";
import { useHistory } from "react-router-dom";



const FormQuestion = (props: formQuestionProps) => {
    const [category, setCategory] = useState<CategorySubject[]>([]);
    const [subject, setSubject] = useState<Subject[]>([]);
    const [categoryForm, setCategoryForm] = useState('');
    const { user } = useContext(UserContext);
    const history = useHistory();



    
    //get tous les champs du forum
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<Post> = data => sendForm(data);

	useEffect(() => {
		const getCategory = async () => {
			const data = await api.db.forum.categories.get({});
			setCategory(data.map((d: any) => plainToClass(CategorySubject, d)))
		};
		getCategory();
	}, [])

    useEffect(() => {
        const getSubject = async () => {
            if (categoryForm !== '') {
                const data = await api.db.forum.categories.getById({ id: categoryForm })
                const subjectdata = data.subjects;
                setSubject(subjectdata.map((d: any) => plainToClass(Subject, d)));
            }   
        }
        getSubject();
    }, [categoryForm])

    function handleChangeCategory(event: { target: { value: SetStateAction<string>; }; }) {
        setCategoryForm(event.target.value);
    }

   
    async function sendForm(data: Post) {
        const date = new Date();
        let string = date.toString();
        string = string.substring(0,24);
        data.created_at = string;
        
        if (user) {
            data.creator = user;
        }

        const response = await api.db.forum.createQuestion(data);
        if (response) {
            history.push('/forum');
        }
            
    }
    
    return (
        <div>
        <CenteredContainer
            horizontally
            textAlign="center"
            style={{ paddingLeft: '100px', paddingRight: '100px' }}
        >
            <CardContainer asRow title="Formulaire : ">
            <Form style={{ width: '30rem' }} onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3 text-left" >
                    <Form.Label>Titre : </Form.Label>
                    <Form.Control type="title" id="formTitre" {...register('title')}/>
                </Form.Group>
                <Form.Group className="mb-3 text-left">
                    <Form.Label>Description : </Form.Label>
                    <Form.Control as="textarea" id="formDesc" rows={7} {...register('content')}/>
                </Form.Group>
                <Form.Group className="mb-3 text-left">
                <Form.Label>Catégories : </Form.Label>
                    <select className="form-control" id='selectCategory' onChange={handleChangeCategory}>
                        <option value=""></option>
                        {category.map((c) => 
                        <option value={c.id} key={c.id}>{c.name}</option> 
                        )}
                    </select>
                </Form.Group>
                <Form.Group className="mb-3 text-left">
                <Form.Label>Sujets : </Form.Label>
                    { categoryForm !== '' 
                        ? <select className="form-control " id="select" {...register('subject.id')}>
                          <option value=""></option>
                            {subject.map((s) => 
                            <option key={s.id} value={s.id}>{s.name}</option> 
                            )}
                          </select>
                        : <select className="form-control " disabled>
                        <option value=""></option>
                        </select>
                    }
                </Form.Group>
                <Form.Group className="text-right">
                    <Button variant="primary" id="btn" type="submit">
                    Envoyer
                    </Button>
                </Form.Group>
            </Form>
            </CardContainer>
                </CenteredContainer>
    </div>
    )
};

export default FormQuestion;