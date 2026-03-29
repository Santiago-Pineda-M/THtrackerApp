import { useEffect, useState } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityLogDetailState, LogValueRequest, IActivityValueDefinitionsState } from '../../../../../Domain';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import { Input } from '../../atoms/Input/Input';
import Spinner from '../../atoms/Spinner/Spinner';
import styles from './ActivityLogValuesForm.module.css';

interface ActivityLogValuesFormProps {
    logId: string;
    activityId: string;
}

export const ActivityLogValuesForm: React.FC<ActivityLogValuesFormProps> = ({ logId, activityId }) => {
    const { providerActivityLogDetailPloc, providerActivityValueDefinitionsListPloc } = useDependencies();
    
    const detailState = usePlocState<IActivityLogDetailState>(providerActivityLogDetailPloc);
    const definitionsState = usePlocState<IActivityValueDefinitionsState>(providerActivityValueDefinitionsListPloc);

    const [formValues, setFormValues] = useState<Record<string, string>>({});

    useEffect(() => {
        providerActivityLogDetailPloc.getLogDetail(logId);
        providerActivityValueDefinitionsListPloc.loadDefinitions(activityId);
    }, [logId, activityId, providerActivityLogDetailPloc, providerActivityValueDefinitionsListPloc]);

    useEffect(() => {
        if (detailState.log?.values) {
            const initialValues: Record<string, string> = {};
            detailState.log.values.forEach(v => {
                initialValues[v.valueDefinitionId] = v.value || '';
            });
            setFormValues(prev => ({...prev, ...initialValues}));
        }
    }, [detailState.log?.values]);

    const handleChange = (definitionId: string, value: string) => {
        setFormValues(prev => ({ ...prev, [definitionId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const requests: LogValueRequest[] = definitionsState.definitions
            .filter(def => formValues[def.id] !== undefined && formValues[def.id] !== '')
            .map(def => ({
                valueDefinitionId: def.id,
                value: formValues[def.id] || null
            }));

        if (requests.length > 0) {
            providerActivityLogDetailPloc.saveValues(logId, requests);
        }
    };

    if (detailState.isLoading && !detailState.log) {
        return <div className={styles.loading}><Spinner size="sm" /></div>;
    }

    if (definitionsState.definitions.length === 0) {
        return (
            <div className={styles.emptyForm}>
                <Text color="secondary" size="sm">
                    Esta actividad no tiene propiedades definidas. 
                    Ve a las definiciones de la actividad para agregar métricas, pesos o campos de texto a registrar.
                </Text>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <Text weight="bold" className={styles.formTitle}>Registrar Valores (Métricas)</Text>
            
            <div className={styles.fieldsGrid}>
                {definitionsState.definitions.map(def => (
                    <div key={def.id} className={styles.fieldItem}>
                        <label className={styles.fieldLabel}>
                            <Text size="sm" weight="medium">{`${def.name || 'Propiedad'} ${def.unit ? `(${def.unit})` : ''}`}</Text>
                        </label>
                        <Input
                            type={def.valueType === 'Number' ? 'number' : 'text'}
                            value={formValues[def.id] || ''}
                            onChange={(e) => handleChange(def.id, e.target.value)}
                            placeholder={`Ingresa ${def.name ? def.name.toLowerCase() : 'valor'}`}
                            required={def.isRequired}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.formActions}>
                {detailState.success && (
                    <Text color="success" size="sm">{detailState.message}</Text>
                )}
                {detailState.error && (
                    <Text color="danger" size="sm">{detailState.error.detail}</Text>
                )}
                <Button 
                    type="submit" 
                    variant="secondary" 
                    disabled={detailState.isLoading}
                >
                    Guardar Valores
                </Button>
            </div>
        </form>
    );
};
