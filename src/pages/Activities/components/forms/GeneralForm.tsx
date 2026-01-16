interface GeneralFormData {
    name: string;
    meta: string;
}

interface GeneralFormProps {
    data: GeneralFormData;
    onUpdate: (data: Partial<GeneralFormData>) => void;
    labels: {
        name: string;
        meta: string;
        placeholder: string;
    };
}

export default function GeneralForm({ data, onUpdate, labels }: GeneralFormProps) {
    return (
        <>
            <div className="form-group">
                <label>{labels.name}</label>
                <input
                    type="text"
                    placeholder={labels.placeholder}
                    value={data.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className="modal-input"
                    required
                    autoFocus
                />
            </div>
            <div className="form-group">
                <label>{labels.meta} (Opcional)</label>
                <input
                    type="text"
                    placeholder="..."
                    value={data.meta}
                    onChange={e => onUpdate({ meta: e.target.value })}
                    className="modal-input"
                />
            </div>
        </>
    );
}
