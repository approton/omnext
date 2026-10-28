import styles from "./auth-methods.module.css";

const methods = [
  { icon: "✉", label: "Email + password", detail: "OTP verification" },
  { icon: "G", label: "Google", detail: "Federated sign-in" },
  { icon: "⊞", label: "Microsoft", detail: "Federated sign-in" },
];

export default function AuthMethods() {
  return (
    <ul className={styles.methods} aria-label="Available sign-in methods">
      {methods.map((method) => (
        <li className={styles.method} key={method.label}>
          <span className={styles.icon} aria-hidden="true">
            {method.icon}
          </span>
          <span className={styles.copy}>
            <strong>{method.label}</strong>
            <small>{method.detail}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
