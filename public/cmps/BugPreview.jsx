export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <h5>labels: <span>{bug.labels.join(', ')}</span></h5>
    </article>
}