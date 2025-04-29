import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styles from "@styles/pages/login.module.scss";
import { FaGoogle, FaGithub, FaGitlab, FaWeixin, FaQq, FaKey, FaMobileAlt } from "react-icons/fa";

// Validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

const Login = () => {
    // Random nature image from Unsplash
    const backgroundImage = "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80";

    const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
        try {
            // TODO: Implement login logic
            console.log("Login attempt with:", values);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        // TODO: Implement social login logic
        console.log(`${provider} login clicked`);
    };

    return (
        <div className={styles.loginPage}>
            <section className={styles.imageSection} style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className={styles.brandContent}>
                    <h2>Welcome to Our Platform</h2>
                    <p>
                        Join our community of creators and professionals. Discover a world of possibilities with our
                        cutting-edge platform.
                    </p>
                </div>
            </section>

            <section className={styles.formSection}>
                <div className={styles.header}>
                    <h1>Welcome back</h1>
                    <p>Please sign in to continue to your account.</p>
                </div>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email address</label>
                                <Field type="email" name="email" id="email" placeholder="Enter your email" />
                                {errors.email && touched.email && <div className={styles.error}>{errors.email}</div>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <Field
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                />
                                {errors.password && touched.password && (
                                    <div className={styles.error}>{errors.password}</div>
                                )}
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className={styles.socialLogin}>
                    <div className={styles.divider}>
                        <span>Or continue with</span>
                    </div>
                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.sso} onClick={() => handleSocialLogin("sso")}>
                            <FaKey />
                            <span>Enterprise SSO</span>
                        </button>
                        <button type="button" className={styles.google} onClick={() => handleSocialLogin("google")}>
                            <FaGoogle />
                            <span>Continue with Google</span>
                        </button>
                        <button type="button" className={styles.github} onClick={() => handleSocialLogin("github")}>
                            <FaGithub />
                            <span>Continue with GitHub</span>
                        </button>
                        <button type="button" className={styles.gitlab} onClick={() => handleSocialLogin("gitlab")}>
                            <FaGitlab />
                            <span>Continue with GitLab</span>
                        </button>
                        <button type="button" className={styles.wechat} onClick={() => handleSocialLogin("wechat")}>
                            <FaWeixin />
                            <span>Continue with WeChat</span>
                        </button>
                        <button type="button" className={styles.qq} onClick={() => handleSocialLogin("qq")}>
                            <FaQq />
                            <span>Continue with QQ</span>
                        </button>
                        <button type="button" className={styles.phone} onClick={() => handleSocialLogin("phone")}>
                            <FaMobileAlt />
                            <span>Continue with Phone</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <a href="/forgot-password">Forgot password?</a>
                    <span className="mx-2">·</span>
                    Don't have an account? <a href="/register">Sign up</a>
                </div>
            </section>
        </div>
    );
};

export default Login;
