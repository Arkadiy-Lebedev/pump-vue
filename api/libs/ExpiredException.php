<?php

namespace Firebase\JWT;

class ExpiredException 
{
    private  $payload;

    public function setPayload( $payload)
    {
        $this->payload = $payload;
    }

    public function getPayload()
    {
        return $this->payload;
    }
}
