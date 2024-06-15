from odoo import models, fields, _

class ProjectSafety(models.Model):
    _name = 'project.safety'
    _description = 'Project Safety'

    name = fields.Char(string=_('Safety Check Name'), required=True)
    project_id = fields.Many2one('project.project', string=_('Project'), required=True)
    safety_description = fields.Text(string=_('Safety Description'))
    safety_measure = fields.Text(string=_('Safety Measure'))
    status = fields.Selection([
        ('planned', _('Planned')),
        ('in_progress', _('In Progress')),
        ('completed', _('Completed')),
    ], string=_('Status'), default='planned')

class ProjectRisk(models.Model):
    _name = 'project.risk'
    _description = 'Project Risk'

    name = fields.Char(string=_('Risk Name'), required=True)
    project_id = fields.Many2one('project.project', string=_('Project'), required=True)
    risk_description = fields.Text(string=_('Risk Description'))
    risk_level = fields.Selection([
        ('low', _('Low')),
        ('medium', _('Medium')),
        ('high', _('High')),
    ], string=_('Risk Level'), default='low')
    mitigation_plan = fields.Text(string=_('Mitigation Plan'))
    status = fields.Selection([
        ('identified', _('Identified')),
        ('mitigated', _('Mitigated')),
        ('resolved', _('Resolved')),
    ], string=_('Status'), default='identified')
