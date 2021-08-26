import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../auth'
import Recipe from './Recipe'
import { Modal, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'






const LoggedinHome = () => {
    const [recipes, setRecipes] = useState([]);
    const [show, setShow] = useState(false);
    const [recipeId, setRecipeId] = useState(1);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const history = useHistory()

    const reload = () => window.location.reload();

    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')




    const closeModal = () => {
        setShow(false)
    }


    useEffect(
        () => {
            fetch('/recipe/recipes')
                .then(res => res.json())
                .then(data => {
                    setRecipes(data)
                })
                .catch(err => console.log(err))
        }, []
    );

    const showModal = (id) => {
        console.log("Hello ", id)
        setShow(true)
        setRecipeId(id)

        recipes.map(
            (recipe) => {
                if (recipe.id == id) {
                    setRecipeId(id)
                    setValue('title', recipe.title)
                    setValue('description', recipe.description)
                }
            }
        )

    }



    const getAllRecipes = () => {

        fetch('/recipe/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data)
            })
            .catch(err => console.log(err))
    }
    const updateRecipe = (data) => {

        console.log(recipeId)
        const requestOptions = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },

            body: JSON.stringify(data)
        }

        fetch(`recipe/recipe/${recipeId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                getAllRecipes()

            })
            .catch(err => console.log(err))

        setShow(false)
    }


    const deleteRecipe = (id, index) => {
        console.log(`deleting ${id}`)


        fetch(`/recipe/recipe/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => response.json())
            .then(data => {

                fetch('/recipe/recipes')
                    .then(res => res.json())
                    .then(data => {
                        setRecipes(data)
                    })
                    .catch(err => console.log(err))

            })

            .catch(err => console.log(err))


    }

    return (
        <div className="recipes container">
            <Modal
                show={show}
                onHide={closeModal}
                size="lg"

            >
                <Modal.Header closeButton>
                    <Modal.Title>Update A Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text"
                                {...register('title', { required: true, maxLength: 25 })}
                            />
                        </Form.Group>
                        {errors.title && <p style={{ color: 'red' }}><small>Title is required</small></p>}
                        {errors.title?.type === "maxLength" && <p style={{ color: 'red' }}>
                            <small>Title should be less than 25 characters</small>
                        </p>}
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={5}
                                {...register('description', { required: true, maxLength: 255 })}
                            />
                        </Form.Group>
                        {errors.description && <p style={{ color: 'red' }}><small>Description is required</small></p>}
                        {errors.description?.type === "maxLength" && <p style={{ color: 'red' }}>
                            <small>Description should be less than 255 characters</small>
                        </p>}
                        <br></br>
                        <Form.Group>
                            <Button variant="primary" onClick={handleSubmit(updateRecipe)}>
                                Save
                            </Button>
                        </Form.Group>
                    </form>
                </Modal.Body>

            </Modal>
            {
                recipes.length > 0 ?
                    <div>
                        <h1>List of Recipes</h1>
                        {
                            recipes.map(
                                (recipe, index) => (
                                    <Recipe title={recipe.title}
                                        onClick={() => { showModal(recipe.id) }}
                                        key={index}
                                        description={recipe.description}
                                        onDelete={() => { deleteRecipe(recipe.id, index) }}
                                    />
                                )
                            )
                        }
                    </div> :
                    <div>
                        There are currently no recipes
                    </div>
            }
        </div>
    )
}


const LoggedOutHome = () => {
    return (
        <div className="home container">
            <h1 className="heading">Welcome to the Recipes</h1>
            <Link to='/signup' className="btn btn-primary btn-lg">Get Started</Link>
        </div>
    )
}

const HomePage = () => {

    const [logged] = useAuth()

    return (
        <div>
            {logged ? <LoggedinHome /> : <LoggedOutHome />}
        </div>
    )
}

export default HomePage