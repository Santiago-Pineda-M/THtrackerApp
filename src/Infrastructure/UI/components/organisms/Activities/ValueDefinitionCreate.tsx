/**
 * ValueDefinitionCreate - Componente para crear una nueva definición de valor.
 * Muestra un modal con un formulario completo.
 */
import React, { useEffect, useState } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IValueDefinitionCreateFormState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import Input from '../../atoms/Input/Input';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import { Modal } from '../../molecules/Modal/Modal';
import { FormField } from '../../molecules/Form/FormField';


interface ValueDefinitionCreateProps {
    activityId: string;
    onSuccess?: () => void;
}

const valueTypeOptions = [
    { value: 'Number', label: 'Número' },
    { value: 'Text', label: 'Texto' },
    { value: 'Boolean', label: 'Verdadero/Falso (Booleano)' },
    { value: 'Duration', label: 'Duración (minutos)' },
];

export const ValueDefinitionCreate: React.FC<ValueDefinitionCreateProps> = ({ activityId, onSuccess }) => {
    const { providerValueDefinitionCreateFormPloc } = useDependencies();
    const formState = usePlocState<IValueDefinitionCreateFormState>(providerValueDefinitionCreateFormPloc);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            providerValueDefinitionCreateFormPloc.init(activityId);
        } else {
            providerValueDefinitionCreateFormPloc.reset();
        }
    }, [isOpen, activityId, providerValueDefinitionCreateFormPloc]);

    // Ocultar modal solo cuando cambia a éxito
    useEffect(() => {
        if (formState.success && isOpen) {
            const timer = setTimeout(() => {
                setIsOpen(false);
                if (onSuccess) onSuccess();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [formState.success, isOpen, onSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await providerValueDefinitionCreateFormPloc.submit();
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={() => setIsOpen(true)}
            >
                <Icon name="Plus" size={16} />
                <span>Añadir</span>
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Nueva Propiedad Configurable"
            >
                <div style={{ padding: '24px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        <FormField label="Nombre de la propiedad" required error={formState.errors?.name?.[0]}>
                            <Input
                                type="text"
                                value={formState.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => providerValueDefinitionCreateFormPloc.updateName(e.target.value)}
                                placeholder="Ej. Peso, Distancia, Sentimiento"
                            />
                        </FormField>

                        <FormField label="Tipo de Valor" error={formState.errors?.valueType?.[0]}>
                            <select
                                value={formState.valueType}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => providerValueDefinitionCreateFormPloc.updateValueType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--surface-color)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {valueTypeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <Text size="sm" weight="medium" color="default">
                                ¿Es obligatorio registrar este valor?
                            </Text>
                            <ToggleSwitch
                                checked={formState.isRequired}
                                onChange={(checked: boolean) => providerValueDefinitionCreateFormPloc.updateIsRequired(checked)}
                            />
                        </div>

                        <FormField label="Unidad de medida (opcional)">
                            <Input
                                type="text"
                                value={formState.unit}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => providerValueDefinitionCreateFormPloc.updateUnit(e.target.value)}
                                placeholder="Ej. kg, km, repeticiones"
                            />
                        </FormField>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <FormField label="Valor Mínimo (opcional)">
                                    <Input
                                        type="number"
                                        value={formState.minValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => providerValueDefinitionCreateFormPloc.updateMinValue(e.target.value)}
                                        placeholder="Ej. 0"
                                    />
                                </FormField>
                            </div>
                            <div style={{ flex: 1 }}>
                                <FormField label="Valor Máximo (opcional)">
                                    <Input
                                        type="number"
                                        value={formState.maxValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => providerValueDefinitionCreateFormPloc.updateMaxValue(e.target.value)}
                                        placeholder="Ej. 100"
                                    />
                                </FormField>
                            </div>
                        </div>

                        {formState.errors?.general && (
                            <Text size="sm" style={{ color: 'var(--status-danger)', marginTop: '0.5rem' }}>
                                {formState.errors.general[0]}
                            </Text>
                        )}

                        {formState.message && !formState.errors?.general && (
                            <Text size="sm" style={{ color: formState.success ? 'var(--status-success)' : 'var(--status-danger)', marginTop: '0.5rem' }}>
                                {formState.message}
                            </Text>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => { /* el form trigger onSubmit natural */ }}
                                /* type submit inside a React form requires the button to be submit, but Button expects a string or default */
                                loading={formState.isLoading}
                            >
                                Guardar Propiedad
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};
