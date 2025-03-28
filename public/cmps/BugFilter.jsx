const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }
        if (field === 'labels') {
            value = value ? value.split(',').map(v => v.trim()) : []
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     onSetFilterBy(filterByToEdit)
    // }

    const { txt, minSeverity, labels } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label>Labels: <input value={labels.join(', ')} onChange={handleChange} type="text" name="labels" placeholder="e.g., critical, bug" /></label>
            </form>
        </section>
    )
}