import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "@styles/pages/forgot-password.module.scss";

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
    // Random nature image from Unsplash
    const backgroundImage = "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80";

    const handleSubmit = async (values: { email: string }, { setSubmitting }: FormikHelpers<{ email: string }>) => {
        try {
            // TODO: Implement password reset logic
            console.log("Password reset request for:", values.email);
        } catch (error) {
            console.error("Password reset error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <section className={styles.imageSection} style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className={styles.brandContent}>
                    <h2>Password Recovery</h2>
                    <p>
                        Don't worry, we'll help you get back into your account. Follow the simple steps to reset your
                        password.
                    </p>
                </div>
            </section>

            <section className={styles.formSection}>
                <div className={styles.header}>
                    <h1>Reset Your Password</h1>
                    <p>Enter your email address and we'll send you instructions to reset your password.</p>
                </div>

                <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
                    {({ errors, touched, isSubmitting }) => (
                        <Form className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email address</label>
                                <Field type="email" name="email" id="email" placeholder="Enter your email" />
                                {errors.email && touched.email && <div className={styles.error}>{errors.email}</div>}
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? "Sending Instructions..." : "Send Reset Instructions"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className={styles.footer}>
                    Remember your password? <a href="/login">Back to login</a>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;
