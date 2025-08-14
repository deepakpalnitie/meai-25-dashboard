Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'acreage')

Source
pages\project.js (106:98) @ acreage

  104 | <Paper2 elevation={3} sx={{ background: "rgb(23, 109, 10)" }}>
  105 |   <Typography color="#ddd" variant="subtitle2">Total UDP acreage</Typography>
> 106 |   <Typography color="#fff" variant='h4' component="p"><CountUp end={data.impactData.acreage.total} duration={5} /></Typography>
      |                                                                                    ^
  107 |   <Typography color="#ddd" variant="subtitle2">Acres</Typography>
  108 | </Paper2>
  109 | <Paper2 elevation={3} sx={{ background: "#f8b400" }}>