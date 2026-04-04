/* EmptyState Styles */

.ui-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  text-align: center;
}

.ui-empty-state__icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.8;
}

.ui-empty-state__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.ui-empty-state__description {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-6) 0;
  max-width: 400px;
}

.ui-empty-state__action {
  display: flex;
  gap: var(--spacing-3);
}