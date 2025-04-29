import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styles from "@styles/pages/register.module.scss";
import { FaGoogle, FaGithub, FaGitlab } from "react-icons/fa";

// Validation schema
const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        )
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
});

const Register = () => {
    // Random nature image from Unsplash
    const backgroundImage = "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80";

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            // TODO: Implement registration logic
            console.log("Register attempt with:", values);
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSocialRegister = (provider: string) => {
        // TODO: Implement social registration logic
        console.log(`${provider} registration clicked`);
    };

    return (
        <div className={styles.registerPage}>
            <section className={styles.imageSection} style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className={styles.brandContent}>
                    <h2>Join Our Community</h2>
                    <p>
                        Create an account and start your journey with us. Get access to exclusive features and join
                        thousands of creators.
                    </p>
                </div>
            </section>

            <section className={styles.formSection}>
                <div className={styles.header}>
                    <h1>Create Account</h1>
                    <p>Fill in your details to get started.</p>
                </div>

                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="username">Username</label>
                                <Field type="text" name="username" id="username" placeholder="Choose a username" />
                                {errors.username && touched.username && (
                                    <div className={styles.error}>{errors.username}</div>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email address</label>
                                <Field type="email" name="email" id="email" placeholder="Enter your email" />
                                {errors.email && touched.email && <div className={styles.error}>{errors.email}</div>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" id="password" placeholder="Create a password" />
                                {errors.password && touched.password && (
                                    <div className={styles.error}>{errors.password}</div>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <div className={styles.error}>{errors.confirmPassword}</div>
                                )}
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className={styles.socialLogin}>
                    <div className={styles.divider}>
                        <span>Or sign up with</span>
                    </div>
                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.google} onClick={() => handleSocialRegister("google")}>
                            <FaGoogle />
                            <span>Sign up with Google</span>
                        </button>
                        <button type="button" className={styles.github} onClick={() => handleSocialRegister("github")}>
                            <FaGithub />
                            <span>Sign up with GitHub</span>
                        </button>
                        <button type="button" className={styles.gitlab} onClick={() => handleSocialRegister("gitlab")}>
                            <FaGitlab />
                            <span>Sign up with GitLab</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    Already have an account? <a href="/login">Sign in</a>
                </div>
            </section>
        </div>
    );
};

export default Register;
