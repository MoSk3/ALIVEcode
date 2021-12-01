import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import CardContainer from "../../Components/UtilsComponents/CardContainer/CardContainer";
import CenteredContainer from "../../Components/UtilsComponents/CenteredContainer/CenteredContainer";
import api from "../../Models/api";
import { Post } from "../../Models/Forum/post.entity";
import { QuestionProps } from "./questionTypes";



const DetailsQuestion = (props: QuestionProps) => {
    const [post, setPost] = useState<Post>();

    useEffect(() => {
		const getPost = async () => {
			const data = await api.db.forum.getById({ id: props.match.params.id });
            setPost(data);
		};
		getPost();
	}, [props.match.params.id])
    return (
        <div>
        <CenteredContainer
            horizontally
            textAlign="center"
            style={{ paddingLeft: '100px', paddingRight: '100px' }}
        >
            <CardContainer asRow title="Question : ">
                {post && 
                <div>
                <Card.Title>{post.title}</Card.Title>
                <div>{post.content}</div>
                <div className="text-right">{post.creator.email}</div>
                </div>
                }
            </CardContainer>
            
        </CenteredContainer>
    </div>
    )
};

export default DetailsQuestion;