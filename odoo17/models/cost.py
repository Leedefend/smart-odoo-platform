from odoo import models, fields, _

class ProjectCost(models.Model):
    _name = 'project.cost'
    _description = 'Project Cost'

    name = fields.Char(string=_('Cost Name'), required=True)
    project_id = fields.Many2one('project.project', string=_('Project'), required=True)
    cost_type = fields.Selection([
        ('investment', _('Investment')),
        ('contract', _('Contract')),
        ('actual', _('Actual Cost')),
    ], string=_('Cost Type'), required=True)
    amount = fields.Float(string=_('Amount'), required=True)
    status = fields.Selection([
        ('planned', _('Planned')),
        ('incurred', _('Incurred')),
        ('paid', _('Paid')),
    ], string=_('Status'), default='planned')
