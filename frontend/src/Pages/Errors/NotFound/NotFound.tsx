import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export const NotFound = () => {
    return (
        <section className="w-full m-auto  mt-8 ">
            <h1 className="text-teal-900 text-5xl">404</h1>
            <h2 className="text-teal-700 text-3xl">
                Cette page n'existe pas, a été déplacée ou vous venez du futur.
            </h2>
            <Link to="/" className="text-blue-500 text-2xl">Retour à l'accueil.</Link>
            <img
                src="/Assets/logo-lrima.png" alt="Logo - LRIma" className="m-auto not-found-logo"
            />
        </section>
    )
}