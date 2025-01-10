import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaClipboard } from 'react-icons/fa'; // For the copy icon
import api from '../axios';
import { useSelector } from "react-redux";

const ShortenUrlPage = () => {
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')
    const user = useSelector((state) => state.auth.user);
    const token=useSelector((state)=>state.auth.token)
    console.log(user,'user deatils from home page after login for redux');
    console.log(token,'token deatils from home page after login from redux');

    useEffect(() => {
        if (user) {
            // console.log(`User logged in: ${user.name}`);
        }
    }, [user]);

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/users/shorten-url', { url });
            setShortenedUrl(response.data.shortenedUrl);
            toast.success('URL shortened successfully!');
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Error in shortening URL');
            toast.error(error.response?.data?.message || 'Error in shortening URL');
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl);
        toast.info('Shortened URL copied to clipboard!');
    };

    return (
        <Container>
            <Row className="my-5">
                {/* Informative Section */}
                <Col md={4} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                    <h5>About Our App</h5>
                    <p>
                        Shorten your long URLs effortlessly! With our tool, you can make your links easy to share and track clicks. 
                        Experience fast, reliable, and secure URL shortening.
                    </p>
                </Col>

                {/* Main Form Section */}
                <Col md={8}>
                    <h2 className="text-primary">Shorten Your URL with Ease and Safety</h2>
                    <p className="text-muted">Transform your long URLs into short and shareable links instantly.</p>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleUrlSubmit}>
                        <Form.Group controlId="url">
                            <Form.Label>Enter URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter long URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button className="mt-3" variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Shorten URL'}
                        </Button>
                    </Form>

                    {shortenedUrl && (
                        <Alert variant="info" className="mt-4">
                            <h5>Hurray! URL Shortened Successfully!</h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
                                    {shortenedUrl}
                                </a>
                                <Button
                                    variant="outline-secondary"
                                    onClick={copyToClipboard}
                                    style={{ marginLeft: '10px', padding: '5px 10px' }}
                                >
                                    <FaClipboard /> Copy
                                </Button>
                            </div>
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ShortenUrlPage;
